import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, StatusBar } from 'react-native';


export default function CustomHeader() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Image source={require("../../../assets/logo_adote.png")}  style={styles.logo} />
        <Text style={styles.headerText}>Pet Hug</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#C8B2F6', // Mesma cor do header para preencher a área da status bar
  },
  headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#C8B2F6', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderBottomWidth: 1.5, 
    borderBottomColor: '#392566', // Cor da linha inferior (um roxo escuro)
    // Se estiver no Android e quiser adicionar a elevação da status bar:
    // paddingTop: StatusBar.currentHeight, 
  },
  logo: {
    width: 45, // Largura da imagem
    height: 45, // Altura da imagem
    borderRadius: 22.5, // Metade da largura/altura para ficar perfeitamente redonda
    marginRight: 12, // Espaço entre a imagem e o texto
  },
  headerText: {
    fontSize: 22, // Tamanho da fonte
    fontFamily:'Itim-Regular', // Deixa o texto em negrito
    color: '#392566', // Cor do texto (o mesmo roxo escuro da borda)
  },
});