import React from 'react';
import { View, Text, Image, StyleSheet,  StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/auth';
import { Ionicons } from '@expo/vector-icons';



export default function CustomHeader() {
const { handleLogout } = useAuth();
  return (
    <SafeAreaView>
      <View style={styles.headerContainer}>
        <Image source={require("../../../assets/logo_adote.png")}  style={styles.logo} />
        <Text style={styles.headerText}>Pet Hug</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Ionicons name="exit-outline" size={28} color='#392566' />
      </TouchableOpacity>
        <StatusBar barStyle="dark-content" backgroundColor="#C8B2F3" />
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#C8B2F3', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderBottomWidth: 1.5, 
    borderBottomColor: '#392566', 
    justifyContent: 'space-between',
   
  },
  logo: {
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    marginRight: 12, // Espaço entre a imagem e o texto
  },
  headerText: {
    fontSize: 22, // Tamanho da fonte
    fontFamily:'Itim-Regular', // Deixa o texto em negrito
    color: '#392566', // Cor do texto 
  },
  title: {
    fontSize: 24,
    fontFamily: 'Itim-Regular', 
    color: '#392566', // Cor dos seus exemplos
  },
  logoutButton: {
    padding: 5, 
  },
});