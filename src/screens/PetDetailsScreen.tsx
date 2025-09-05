import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./../navigation/stack.routes"

// 🔹 Tipagem da rota PetDetails
type PetDetailsRouteProp = RouteProp<RootStackParamList, "PetDetails">;

type Props = {
  route: PetDetailsRouteProp;
};

export default function PetDetailsScreen({ route }: Props) {
  const { id, title } = route.params; // agora o TS sabe que params existe

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Pet</Text>
      <Text>ID: {id}</Text>
      <Text>Nome: {title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
