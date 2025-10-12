// no seu arquivo screens/AreaPetScreen.js

import React, { useState, useCallback } from "react"; 
import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"; 
import CustomHeader from "../components/Header/CustomHeader";
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AreaPetStackParamList } from "../navigation/AreaPetStack"; 

import { makePetPerfilUseCases } from "../core/factories/MakePetPerfilRepository";
import { PetPerfil } from "../core/domain/entities/PetPerfil";

type NavProp = NativeStackNavigationProp<AreaPetStackParamList, "AreaPetHome">;

export default function AreaPetScreen() {
    const navigation = useNavigation<NavProp>();

   
    const { findByDonoId, deletePerfilPet } = makePetPerfilUseCases();
    const [pets, setPets] = useState<PetPerfil[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            const carregarPets = async () => {
                setLoading(true);
                setError(null);
                try {
                    
                    const petsDoUsuario = await findByDonoId.execute({ donoId: 'user-1-mock' });
                    setPets(petsDoUsuario);
                } catch (err) {
                    setError("Não foi possível carregar a lista de pets.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            carregarPets();
        }, [])
    );
    const handleDeletePet = (petId: string, petName: string) => {
        // Mostra um pop-up de confirmação
        Alert.alert(
            "Confirmar Exclusão", // Título do Alerta
            `Tem certeza que deseja excluir o perfil de "${petName}"? Esta ação não pode ser desfeita.`, // Mensagem
            [
                // Botão 1: Cancelar
                {
                    text: "Cancelar",
                    onPress: () => console.log("Exclusão cancelada"),
                    style: "cancel"
                },
                // Botão 2: Excluir (executa a lógica)
                {
                    text: "Excluir",
                    onPress: async () => {
                        try {
                            // Chama o use case para deletar
                            await deletePerfilPet.execute({ id: petId });
                            
                            // Atualiza a lista na tela na hora, sem precisar recarregar
                            setPets(currentPets => currentPets.filter(pet => pet.id !== petId));
                            
                            Alert.alert("Sucesso!", `"${petName}" foi excluído.`);
                        } catch (err) {
                            console.error("Erro ao deletar pet:", err);
                            Alert.alert("Erro", "Não foi possível excluir o pet.");
                        }
                    },
                    style: "destructive" // Estilo vermelho no iOS para indicar perigo
                }
            ]
        );
    };




return (
    <View style={styles.container}>
        <CustomHeader />
        <View style={styles.content}>
            <Pressable onPress={() => navigation.navigate("CadastrarPet")} style={styles.button}>
                <Text style={styles.text}>Cadastrar Novo Pet</Text>
            </Pressable>

            <Text style={styles.listTitle}>Meus Pets Cadastrados</Text>
            
            {loading ? (
                <ActivityIndicator size="large" color="#392566" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : pets.length === 0 ? (
                <Text style={styles.emptyText}>Você ainda não cadastrou nenhum pet.</Text>
            ) : (
                <FlatList
                    data={pets} 
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.petCard}>
                           
                            <Text style={styles.petName}>{item.name.value}</Text>
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => navigation.navigate('EditarPet', { petId: item.id })}
                            >
                                <Text style={styles.editButtonText}>Editar</Text>
                                
                            </TouchableOpacity>
                             <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeletePet(item.id, item.name.value)}
                                    >
                                        <Text style={styles.buttonText}>Excluir</Text>
                                    </TouchableOpacity>
                        </View>
                    )}
                />
            )}
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

    errorText: {
        color: 'red',
        fontSize: 16,
        marginTop: 20,
    },
    emptyText: {
        color: '#392566',
        fontSize: 16,
        marginTop: 20,
        fontFamily: 'Itim-Regular',
    },
        deleteButton: {
        backgroundColor: '#E57373', // Uma cor vermelha para indicar perigo
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonText: { // Renomeado de editButtonText para ser genérico
        color: '#392566',
        fontWeight: 'bold',
    },

});