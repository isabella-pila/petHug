// src/components/HighLight.tsx

import React from "react";
import {
  StyleSheet,  Text,  View,  TouchableOpacity,  Image, Dimensions,
  ImageSourcePropType,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/stack.routes";
import { HomeStackParamList } from "../../navigation/HomeStack";

const colors = {
  background: "#EEE6FF",
  primary: "#392566",
  text: "#333",
};
const { width } = Dimensions.get("window");

// ✅ CORREÇÃO 1: A tipagem da imagem agora aceita string (URL) ou number (require)
type HighLightProps = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  category?: string;
  descricao: string;
  donoId: string;
};

type NavProp = NativeStackNavigationProp<HomeStackParamList>;

export function HighLight({ id, title, image, category, descricao,donoId }: HighLightProps) {
  const navigation = useNavigation<NavProp>();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate("PetDetails", { id, title, image, descricao , donoId})}
    >
      <Image
        
        source={
          image
            ? typeof image === "string"
              ? { uri: image } 
              : image
            : { uri: "https://placehold.co/200x200?text=Pet" } 
        }
        style={styles.cardImage}
      />
      <Text style={styles.cardTitle}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderColor: colors.primary, 
    borderWidth: 2,
    margin: 8,
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.42,
    aspectRatio: 1,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: "90%",
    height: "70%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  cardTitle: {
    fontFamily:'Itim-Regular',
    fontSize: 16,
    marginTop: 5,
    color: colors.text,
  },
});