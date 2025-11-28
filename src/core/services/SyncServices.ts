import NetInfo from '@react-native-community/netinfo';
import DatabaseConnection from '../infra/sqlite/connection';
import { SupabaseUserRepository } from '../infra/repositories/supabaseUserRepository';

import { IUserRepository } from '../domain/repositories/UserRepository';

import { User } from '../domain/entities/User';

import { Name } from '../domain/value-objects/Name';
import { Email } from '../domain/value-objects/Email';
import { Password } from '../domain/value-objects/Password';
import { GeoCoordinates } from '../domain/value-objects/GeoCoordinates';
import { Photo } from '../domain/value-objects/Photo';


export class SyncService {
  private static instance: SyncService;
  private isSyncing: boolean = false;
  private userRepository: IUserRepository;


  private constructor(
    userRepository: IUserRepository

  ) {
    this.userRepository = userRepository;
 
    NetInfo.addEventListener(state => {
      if (state.isConnected && !this.isSyncing) {
        this.syncAllPendingChanges();
      }
    });
  }

  public static getInstance(
    userRepository: IUserRepository = SupabaseUserRepository.getInstance(),

  ): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService(userRepository);
    }
    return SyncService.instance;
  }

  private async syncAllPendingChanges() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    console.log('Starting sync...');

    try {
      await this.syncUsers();
      await this.processSyncLog();
      console.log('Sync finished successfully.');
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncUsers() {
    const db = await DatabaseConnection.getConnection();
    const pendingUsers = await db.getAllAsync<any>("SELECT * FROM users WHERE sync_status != 'synced'");

    for (const userRow of pendingUsers) {
      const user = User.create(
        userRow.id,
        Name.create(userRow.name),
        Email.create(userRow.email),
        Password.create(userRow.password_hash),
        GeoCoordinates.create(userRow.latitude, userRow.longitude)
      );

      try {
        if (userRow.sync_status === 'pending_create') {
          await this.userRepository.register(user);
        } else if (userRow.sync_status === 'pending_update') {
          await this.userRepository.update(user);
        }
        await db.runAsync("UPDATE users SET sync_status = 'synced' WHERE id = ?", user.id);
      } catch (error) {
        console.error(`Failed to sync user ${user.id}:`, error);
      }
    }
  }

  

  private async processSyncLog() {
    const db = await DatabaseConnection.getConnection();
    const logEntries = await db.getAllAsync<any>("SELECT * FROM sync_log WHERE action = 'delete'");

    for (const logEntry of logEntries) {
      try {
        if (logEntry.entity_type === 'user') {
          await this.userRepository.delete(logEntry.entity_id);
        } 
        await db.runAsync("DELETE FROM sync_log WHERE id = ?", logEntry.id);
      } catch (error) {
        console.error(`Failed to process sync_log entry ${logEntry.id}:`, error);
      }
    }
  }

  public async fetchAndSyncRemoteData() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    console.log('Fetching remote data and syncing local DB...');

    try {
      const remoteUsers = await this.userRepository.findAll();
      await this.updateLocalUsers(remoteUsers);

  

      console.log('Remote data sync finished successfully.');
    } catch (error) {
      console.error('Error during remote data sync:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async updateLocalUsers(remoteUsers: User[]) {
    const db = await DatabaseConnection.getConnection();
    for (const remoteUser of remoteUsers) {
      await db.runAsync(
        'INSERT OR REPLACE INTO users (id, name, email, password_hash, latitude, longitude, sync_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        remoteUser.id,
        remoteUser.name.value,
        remoteUser.email.value,
        remoteUser.password.value,
        remoteUser.location.latitude,
        remoteUser.location.longitude,
        'synced'
      );
    }
  }

 
}