import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomHeader from '../components/Header/CustomHeader';

export default function AdoptionMessageScreen() {
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
});