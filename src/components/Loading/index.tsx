import React from "react";
import { View, StyleSheet, Text } from "react-native";
import LottieView from "lottie-react-native";

export function Loading() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../lotties/gato.json")}
        style={styles.animation}
        autoPlay
        loop
      />
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEE6FF", // mesmo tom do fundo do app
  },
  animation: {
    width: 300,
    height: 300,
  },
  text: {
    marginTop: 100,
    fontSize: 18,
    color: "#392566",
    fontFamily: "Itim-Regular",
  },
});
