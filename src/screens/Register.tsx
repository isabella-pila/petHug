import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Alert, Platform, Image } from 'react-native';
import { ButtonInterface } from '../components/ButtonInterface';
import { Loading } from '../components/Loading';
import { LoginTypes } from '../navigation/LoginstackNavigation';
import { useAuth } from '../context/auth';
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { StyleSheet } from 'react-native';
import { makeUserUseCases } from "../core/factories/MakeUserRepository";

export function RegisterScreen({ navigation }: LoginTypes) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userUseCases = makeUserUseCases();

  async function handleRegister() {
    setLoading(true);
    setError(null);
    try {
      await userUseCases.registerUser.execute({
        name,
        email,
        password,
        latitude: 0, // Mock data
        longitude: 0, // Mock data
      });
      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('Login');
    } catch (err) {
      setError('Failed to register user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
         <View style={{flexDirection:'row', alignItems:'center', marginBottom: 20, justifyContent:'center'}}>
               <Image source={require('../../assets/logo_adote.png')} style={styles.logo} />
               <Text style={styles.headerText}>Pet Hug</Text>
               </View>
       <View style={styles.caixa}> 
        <Text style={styles.title}>Cadastre-se</Text>
        <View style={styles.formRow}>
          <Ionicons name="person" style={styles.icon} />
          <TextInput
            placeholderTextColor={colors.secundary}
            style={styles.input}
            placeholder="Nome"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.formRow}>
          <MaterialIcons name="email" style={styles.icon} />
          <TextInput
            placeholderTextColor={colors.secundary}
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.formRow}>
          <Entypo name="key" style={styles.icon} />
          <TextInput
            placeholderTextColor={colors.secundary}
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={true}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {loading ? (
          <Loading />
        ) : (
          <ButtonInterface title='Salvar' type='secondary' onPress={handleRegister} disabled={loading} />
        )}
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        <ButtonInterface title='Voltar' type='primary' onPress={() => navigation.navigate('Login')} />
          </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const colors = {
  background: '#EEE6FF',
  primary: '#392566',
  secundary: '#F4F3F3'
};
 const styles = StyleSheet.create({
    logo: {
    width: 50, 
    height: 50, 
    borderRadius: 22.5, 
    marginRight: 12, 
  },

  headerText: {
    fontSize: 30, 
    fontFamily:'Itim-Regular', 
    color: '#392566', 
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  caixa:{
    height:'80%',
    width:'120%',
    backgroundColor: colors.secundary,
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center',
    elevation: 5,
  
  },

  title: {
    fontSize: 30,
    fontFamily: "Itim-Regular",
    textAlign: 'center',
    color: colors.primary,
    marginBottom: 20,
  },
  formRow: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: '#d3cfcf',
    borderRadius: 20,
    width: '90%',
    backgroundColor: '#D9D9D9',
  },
  
  icon: {
    fontSize: 28,
    color: colors.primary,
    padding: 5
  },

  input: {
    fontSize: 18,
    padding: 10,
    width: "70%",   
  },
})