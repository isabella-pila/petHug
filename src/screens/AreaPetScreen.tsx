import React, { useState, useCallback } from "react"; 
import { View, Text, StyleSheet, Pressable, FlatList, TouchableOpacity, ActivityIndicator, Alert } from "react-native"; 
import CustomHeader from "../components/Header/CustomHeader";
import { useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AreaPetStackParamList } from "../navigation/AreaPetStack"; 

import { makePetPerfilUseCases } from "../core/factories/MakePetPerfilRepository";
import { PetPerfil } from "../core/domain/entities/PetPerfil";
import { useAuth } from "../context/auth"; 

type NavProp = NativeStackNavigationProp<AreaPetStackParamList, "AreaPetHome">;

export default function AreaPetScreen() {
    const navigation = useNavigation<NavProp>();

    const { user } = useAuth(); 
    
    const { findByDonoId, deletePerfilPet } = makePetPerfilUseCases();
    const [pets, setPets] = useState<PetPerfil[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(

        useCallback(() => {
            const carregarPets = async () => {
                setLoading(true);
                setError(null);

               
                if (!user) {
                    setPets([]); 
                    setLoading(false);
                    return;
                }

                try {
                    
                    const petsDoUsuario = await findByDonoId.execute({ donoId: user.id });
                    setPets(petsDoUsuario);
                } catch (err) {
                    setError("Não foi possível carregar a lista de pets.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            carregarPets();
        }, [user]) 
    );

    const handleDeletePet = (petId: string, petName: string) => {
        Alert.alert(
            "Confirmar Exclusão", 
            `Tem certeza que deseja excluir o perfil de "${petName}"? Esta ação não pode ser desfeita.`, 
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    onPress: async () => {
                        try {
                           
                            await deletePerfilPet.execute({ id: petId });
                            
                        
                            setPets(currentPets => currentPets.filter(pet => pet.id !== petId));
                            
                            Alert.alert("Sucesso!", `"${petName}" foi excluído.`);
                        } catch (err) {
                            console.error("Erro ao deletar pet:", err);
                            Alert.alert("Erro", "Não foi possível excluir o pet.");
                        }
                    },
                    style: "destructive" 
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
                    <Text style={styles.emptyText}>
                        {!user ? "Faça login para ver seus pets." : "Você ainda não cadastrou nenhum pet."}
                    </Text>
                ) : (
                    <FlatList
                        data={pets} 
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.petCard}>
                                <Text style={styles.petName}>{item.name.value}</Text>
                            
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => navigation.navigate('EditarPet', { petId: item.id })}
                                    >
                                       
                                        <Text style={styles.buttonText}>Editar</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => handleDeletePet(item.id, item.name.value)}
                                    >
                                        <Text style={styles.buttonText}>Excluir</Text>
                                    </TouchableOpacity>
                                </View>
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
        // ✨ Largura ajustada para ser responsiva
        width: '100%', 
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
        // ✨ Adicionado flex para o nome não empurrar os botões
        flex: 1, 
        marginRight: 10,
    },
    // ✨ Container para agrupar os botões
    buttonContainer: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: '#C8B2F6',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        // ✨ Adicionado espaço entre os botões
        marginRight: 10,
    },
    deleteButton: {
        backgroundColor: '#E57373',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    // ✨ Estilo de texto unificado
    buttonText: { 
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
        textAlign: 'center',
    },
});