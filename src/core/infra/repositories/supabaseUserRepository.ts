import { supabase } from '../supabase/client/supabaseClient';
import { IUserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Name } from '../../domain/value-objects/Name';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { GeoCoordinates } from '../../domain/value-objects/GeoCoordinates';

export class SupabaseUserRepository implements IUserRepository {
  private static instance: SupabaseUserRepository;

  private constructor() {}

  public static getInstance(): SupabaseUserRepository {
    if (!SupabaseUserRepository.instance) {
      SupabaseUserRepository.instance = new SupabaseUserRepository();
    }
    return SupabaseUserRepository.instance;
  }

  async register(user: User): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email.value,
      password: user.password.value,
    });

    if (authError) {
      throw new Error(authError.message);
    }
    if (!authData.user) {
      throw new Error('Could not create user');
    }


    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      name: user.name.value,
      email: user.email.value, 
      location_lat: user.location.latitude,  
      location_lng: user.location.longitude, 
    });

    if (profileError) {
      console.error("Failed to create user profile:", profileError.message);
      throw new Error('Failed to create user profile after authentication.');
    }

    return User.create(
      authData.user.id,
      user.name,
      user.email,
      Password.create('hashed_123'),
      user.location
    );
  }


  async authenticate(email: string, password: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }
    if (!authData.user) {
      throw new Error('User not found');
    }

    const user = await this.findById(authData.user.id);
    if (!user) {
      throw new Error('User profile not found');
    }

    return user;
  }

 
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  }

  async findById(id: string): Promise<User | null> {
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { 
        throw new Error(profileError.message);
    }
    if (!profileData) {
      return null;
    }

    const latitude = profileData.location_lat ?? 0;
    const longitude = profileData.location_lng ?? 0;

    const name = profileData.name ?? 'Usuário';
    const email = profileData.email ?? '';
    const password = profileData.password ?? 'invalid-password-placeholder';

    return User.create(
      profileData.id,
      Name.create(name), 
      Email.create(email),
      Password.create(password), 
      GeoCoordinates.create(latitude, longitude)
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
        throw new Error(profileError.message);
    }
    if (!profileData) {
      return null;
    }
    
 
    const latitude = profileData.location_lat ?? 0;
    const longitude = profileData.location_lng ?? 0;

    return User.create(
      profileData.id,
      Name.create(profileData.name),
      Email.create(profileData.email),
      Password.create('hashed_123'),
      GeoCoordinates.create(latitude, longitude)
    );
  }

  async update(user: User): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({
        name: user.name.value,
        location_lat: user.location.latitude,
        location_lng: user.location.longitude,
        
      })
      .eq('id', user.id);

    if (error) {
      throw new Error(error.message);
    }
  }
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
    

  }
  async findAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    if (!data) return [];

    return data.map(item => 
      User.create(
        item.id,
        Name.create(item.name ?? 'Sem nome'),
        Email.create(item.email ?? ''),
        Password.create(item.password ?? 'placeholder'),
        GeoCoordinates.create(
            item.location_lat ?? 0, 
            item.location_lng ?? 0
        )
      )
    );
  }

 
}
