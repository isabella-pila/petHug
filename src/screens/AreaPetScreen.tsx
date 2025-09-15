// no seu arquivo screens/AreaPetScreen.js

import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity } from "react-native";
import CustomHeader from "../components/Header/CustomHeader";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// ✨ Certifique-se que o tipo importado é o correto para o seu Stack
import { AreaPetStackParamList } from "../navigation/AreaPetStack"; 


const MEUS_PETS_CADASTRADOS = [
  { id: '1', nome: 'Bolinha', foto: 'url_da_foto_1', descricao: 'Um cãozinho muito amigável.' },
  { id: '2', nome: 'Frajola', foto: 'url_da_foto_2', descricao: 'Gato muito esperto e brincalhão.' },
];

type NavProp = NativeStackNavigationProp<AreaPetStackParamList, "AreaPetHome">;

export default function AreaPetScreen() {
  const navigation = useNavigation<NavProp>();

  return (
    <View style={styles.container}>
      <CustomHeader />
      <View style={styles.content}>
        <Pressable onPress={() => navigation.navigate("CadastrarPet")} style={styles.button}>
          <Text style={styles.text}>Cadastrar Novo Pet</Text>
        </Pressable>

        <Text style={styles.listTitle}>Meus Pets Cadastrados</Text>
        <FlatList
          data={MEUS_PETS_CADASTRADOS}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.petCard}>
              <Text style={styles.petName}>{item.nome}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditarPet', { petId: item.id })}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE6FF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  button: {
    width: '90%',
    height: 60,
    backgroundColor: '#392566',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 30,
  },
  text: { fontSize: 20, fontWeight: "bold", color: '#fff' },
  listTitle: {
    fontSize: 22,
    fontFamily: 'Itim-Regular',
    color: '#392566',
    marginBottom: 15,
  },
  petCard: {
    width: 320,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#C8B2F6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#392566',
    fontWeight: 'bold',
  },
});