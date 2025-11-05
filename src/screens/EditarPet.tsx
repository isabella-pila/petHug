import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Platform, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { ButtonInterface } from '../components/ButtonInterface';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/Header/CustomHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AreaPetStackParamList } from '../navigation/AreaPetStack';
import { makePetPerfilUseCases } from '../core/factories/MakePetPerfilRepository';
import { Picker } from '@react-native-picker/picker';

type EditarPetScreenRouteProp = RouteProp<AreaPetStackParamList, 'EditarPet'>;

export default function EditarPetScreen() {
    const route = useRoute<EditarPetScreenRouteProp>();
    const navigation = useNavigation();
    const { petId } = route.params;

    const { findPerfilPet, updatePerfilPet } = makePetPerfilUseCases();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [nome, setNome] = useState('');
    const [foto, setFoto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [category, setCategory] = useState(''); 

    useEffect(() => {
        const carregarDadosPet = async () => {
            setLoading(true);
            try {
                const petParaEditar = await findPerfilPet.execute({ id: petId });
                if (petParaEditar) {
                    setNome(petParaEditar.name.value);
                    setFoto(petParaEditar.foto.url);
                    setDescricao(petParaEditar.descricao);
                    setCategory(petParaEditar.category); 
                } else {
                    setError('Pet não encontrado.');
                    Alert.alert('Erro', 'Pet não encontrado.');
                }
            } catch (err) {
                setError('Ocorreu um erro ao buscar os dados do pet.');
                Alert.alert('Erro', 'Não foi possível carregar os dados do pet.');
            } finally {
                setLoading(false);
            }
        };
        carregarDadosPet();
    }, [petId]);

    const handleSalvarAlteracoes = async () => {
        setLoading(true);
        setError(null);
        try {
            await updatePerfilPet.execute({
                petId: petId,
                nome: nome,
                photoUrl: foto,
                descricao: descricao,
                category: category, 
            });
            Alert.alert('Sucesso!', 'As informações do pet foram atualizadas.');
            navigation.goBack();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Não foi possível salvar as alterações.';
            setError(errorMessage);
            Alert.alert('Erro', errorMessage);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !nome) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <CustomHeader />
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
                    <View style={styles.caixa}>
                        <Text style={styles.title}>Editar Pet</Text>
                        
                        <View style={styles.formRow}>
                            <Ionicons name="paw-outline" style={styles.icon} />
                            <TextInput placeholderTextColor={colors.primary} style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome}/>
                        </View>
                        
                        <View style={styles.formRow}>
                            <Ionicons name="camera-outline" style={styles.icon} />
                            <TextInput placeholderTextColor={colors.primary} style={styles.input} placeholder="URL da Foto" value={foto} onChangeText={setFoto}/>
                        </View>
                        
                        <View style={styles.formRow}>
                            <Ionicons name="document-text-outline" style={styles.icon} />
                            <TextInput placeholderTextColor={colors.primary} style={styles.input} placeholder="Descrição" value={descricao} onChangeText={setDescricao}/>
                        </View>

                                        <View style={styles.formRow}>
                        <Ionicons name="document-text-outline" style={styles.icon} />
                        
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={category}
                                    onValueChange={(itemValue) =>
                                        setCategory(itemValue)
                                    }
                                    style={styles.picker}
                                >
                            
                                <Picker.Item label="Selecione uma categoria..." value={category} enabled={false} style={{ color: colors.primary }} />
                            
                                <Picker.Item label="Gato" value="gato" />
                                <Picker.Item label="Cachorro" value="cachorro" />
                                <Picker.Item label="Outros" value="outros" />
                            </Picker>
                        </View>
                    </View>
                        
                        {loading ? (
                            <ActivityIndicator size="large" color={colors.primary} style={{ marginVertical: 15 }} />
                        ) : (
                            <ButtonInterface title='Salvar Alterações' type='primary' onPress={handleSalvarAlteracoes} />
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
    
    keyboardView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
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
        marginTop: 50,
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

});