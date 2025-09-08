import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CadastrarPetScreen() {
  return (
    <View style={styles.container}>
      <View></View>
      <Text style={styles.text}>Tela de Cadastro Pet 🐶</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "bold" },
});
