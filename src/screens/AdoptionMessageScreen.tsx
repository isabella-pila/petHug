import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import CustomHeader from '../components/Header/CustomHeader';
import { ButtonInterface } from '../components/ButtonInterface';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';



export default function AdoptionMessageScreen() {
const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <CustomHeader />
      <View style={styles.content}>
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Recebemos sua manifestação de interesse por esse pet! Obrigado por
            nos ajudar a espalhar amor!
          </Text>
          <Text style={styles.messageText}>
            Nos próximos 3 dias, você receberá um e-mail no endereço cadastrado
            com mais informações sobre o processo de adoção, documentos
            necessários e dia do encontro. Caso não o receba, envie um e-mail
            para o endereço de suporte:
          </Text>
          <Text style={styles.emailText}>pethug@queroajuda.com</Text>
        </View>
      <TouchableOpacity  onPress={() => navigation.goBack()} style={styles.button}>
      <Text style={{  color: '#fff', fontSize:20}}>Voltar</Text>
    </TouchableOpacity>
      </View>


    </View>
  );
}

const colors = {
  background: '#EEE6FF',
  primary: '#392566',
  secundary: '#C8B2F6'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  messageBox: {
    backgroundColor: colors.secundary,
    borderRadius: 20,
    padding: 25,
    width: '100%',
    alignItems: 'center',
  },
  messageText: {
    fontFamily: 'Itim-regular', 
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 20,
    color: '#392566',
  },
  emailText: {
    fontFamily: 'Itim-regular',
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#392566',

  },
  button:{
      backgroundColor: '#392566',
    borderRadius: 20,
    margin: 15,
    width: 120,
    color: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height:50, 

  }

});