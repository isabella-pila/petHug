import React, { useState } from 'react';
import {
    KeyboardAvoidingView, View, Text, TextInput, Platform,
    TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image 
} from 'react-native';
import { ButtonInterface } from '../components/ButtonInterface';
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/Header/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { makePetPerfilUseCases } from '../core/factories/MakePetPerfilRepository';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/auth';


import * as ImagePicker from 'expo-image-picker';


const SUPABASE_BUCKET_NAME = 'pets_bucket'; 

export default function CadastrarPetScreen() {
    const navigation = useNavigation();
   
    const { registerPerfilPet, uploadFile } = makePetPerfilUseCases();
    const { user } = useAuth();

    const [nome, setNome] = useState('');
  
    const [foto, setFoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
    
    const [descricao, setDescricao] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pickImage = async () => {
     
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos da permissão da galeria para escolher uma foto.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true, 
        });

        if (!result.canceled) {
           
            setFoto(result.assets[0]);
        }
    };

    const handleCadastrar = async () => {
        
        if (!nome || !foto || !descricao || !category) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos e selecione uma imagem.');
            return;
        }

        if (!user || !user.id) {
            Alert.alert('Erro', 'Você não está logado.');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            
            const finalPhotoUrl = await uploadFile.execute({
                imageAsset: foto, 
                bucket: SUPABASE_BUCKET_NAME,
                userId: user.id
            });

        
            await registerPerfilPet.execute({
                nome,
                photoUrl: finalPhotoUrl,
                descricao,
                category,
                donoId: user.id,
            });

            Alert.alert('Sucesso!', 'Seu pet foi cadastrado!');
            navigation.goBack();

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Não foi possível cadastrar o pet.';
            setError(errorMessage);
            Alert.alert('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CustomHeader />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
                    <View style={styles.caixa}>
                        <Text style={styles.title}>Cadastrar Pet</Text>

                        <View style={styles.formRow}>
                            <Ionicons name="paw-outline" style={styles.icon} />
                            <TextInput
                                placeholderTextColor={colors.primary}
                                style={styles.input}
                                placeholder="Nome"
                                value={nome}
                                onChangeText={setNome}
                            />
                        </View>

                     <View >
                        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                            <EvilIcons name="camera" style={styles.icon} />
                            <Text style={styles.imagePickerText}>
                                {/* ✨ MUDANÇA: Checa 'foto' */}
                                {foto ? "Trocar Imagem" : "Selecionar Imagem"}
                            </Text>
                        </TouchableOpacity>

                      
                        {foto && (
                            <Image
                                source={{ uri: foto.uri }}
                                style={styles.imagePreview}
                            />
                        )}
                    </View>
                    
                        <View style={styles.formRow}>
                            <Ionicons name="document-text-outline" style={styles.icon} />
                            <TextInput
                                placeholderTextColor={colors.primary}
                                style={styles.input}
                                placeholder="Descrição"
                                value={descricao}
                                onChangeText={setDescricao}
                            />
                        </View>

                        
                        <View style={styles.formRow}>
                            <Ionicons name="apps-outline" style={styles.icon} />
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={category}
                                    onValueChange={(itemValue) =>
                                        setCategory(itemValue)
                                    }
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Selecione uma categoria..." value="" enabled={false} style={{ color: colors.grey }} />
                                    <Picker.Item label="Gato" value="gato" />
                                    <Picker.Item label="Cachorro" value="cachorro" />
                                    <Picker.Item label="Outros" value="outros" />
                                </Picker>
                            </View>
                        </View>

                       
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 15 }} />
                        ) : (
                            <ButtonInterface title='Cadastrar' type='primary' onPress={handleCadastrar} />
                        )}

                        {error && <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</Text>}

                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button} disabled={loading}>
                            <Text style={styles.adoptButtonText}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
}

// Seus Estilos + Estilos Novos
const colors = {
    background: '#EEE6FF',
    primary: '#392566',
    secundary: '#F4F3F3',
    grey: '#888',
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    caixa: {
        width: '90%',
        backgroundColor: colors.secundary,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        paddingVertical: 30,
        paddingHorizontal: 15,
        alignSelf: 'center',
    },
    title: {
        fontSize: 30,
        fontFamily: "Itim-Regular",
        textAlign: 'center',
        color: colors.primary,
        marginBottom: 20,
    },
    formRow: {
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: '#d3cfcf',
        borderRadius: 10,
        width: '95%',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    icon: {
        fontSize: 24,
        color: colors.primary,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: 50,
        color: colors.primary,
    },
    pickerContainer: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
        height: '110%',
        color: colors.primary,
    },
    button: {
        backgroundColor: '#392566',
        borderRadius: 20,
        marginTop: 15,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    adoptButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Itim-regular',
    },
    
imagePickerButton: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#d3cfcf',
    borderRadius: 10,
    width: '95%',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 50,
    borderStyle: 'dashed',
},
imagePickerText: {
    flex: 1,
    fontSize: 16,
    color: colors.primary,
    fontFamily: "Itim-Regular",
},
imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.grey,
    alignSelf: 'center',
    marginTop: 10,
},

});