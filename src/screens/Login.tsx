import React from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Platform, Image } from 'react-native';

import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { StyleSheet } from 'react-native';
import { LoginTypes } from '../navigation/LoginstackNavigation';
import { useAuth } from '../context/auth';
import { ButtonInterface } from '../components/ButtonInterface/index';

const colors = {
  background: '#EEE6FF',
  primary: '#392566',
  secondary: "#F4F3F3"
};

export function LoginScreen({ navigation }: LoginTypes) {
  const {setLogin} = useAuth()
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
       <View style={{flexDirection:'row', alignItems:'center', marginBottom: 20, justifyContent:'center'}}>
        <Image source={require('../../assets/logo_adote.png')} style={styles.logo} />
        <Text style={styles.headerText}>Pet Hug</Text>
       </View>
       <View style={styles.caixa}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.formRow}>
          <MaterialIcons name="email" style={styles.icon} />
          <TextInput
            placeholderTextColor={colors.primary}
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.formRow}>
          <Entypo name="key" style={styles.icon} />
          <TextInput
            placeholderTextColor={colors.primary}
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={true}
            autoCapitalize="none"
          />
        </View>
        <ButtonInterface title='Login' type='primary' onPress={()=> setLogin(true)} />
        <ButtonInterface title='Cadastre-se' type='secondary' onPress={() => navigation.navigate("Register")} />
        </View>
      </KeyboardAvoidingView>
    
    </View>
  );

  
}
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
    backgroundColor: colors.secondary,
    borderRadius:50,
    justifyContent:'center',
    alignItems:'center',
    paddingTop: '10%',
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
