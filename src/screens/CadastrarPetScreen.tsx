import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Platform, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { ButtonInterface } from '../components/ButtonInterface';
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/Header/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { makePetPerfilUseCases } from '../core/factories/MakePetPerfilRepository';

export default function CadastrarPetScreen() {
    const navigation = useNavigation();
    const { registerPerfilPet } = makePetPerfilUseCases();

    const [nome, setNome] = useState('');
    const [foto, setFoto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCadastrar = async () => {
        if (!nome || !foto || !descricao) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await registerPerfilPet.execute({
                nome,
                photoUrl: foto,
                descricao,
                category,
                donoId: 'user-1-mock', 
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

                        <View style={styles.formRow}>
                            <EvilIcons name="camera" style={styles.icon} />
                            <TextInput
                                placeholderTextColor={colors.primary}
                                style={styles.input}
                                placeholder="URL da Foto"
                                value={foto}
                                onChangeText={setFoto}
                            />
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
                            <Ionicons name="document-text-outline" style={styles.icon} />
                            <TextInput
                                placeholderTextColor={colors.primary}
                                style={styles.input}
                                placeholder="categoria"
                                value={category}
                                onChangeText={setCategory}
                            />
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

const colors = {
    background: '#EEE6FF',
    primary: '#392566',
    secundary: '#F4F3F3'
};

// ...Seus estilos (styles) permanecem os mesmos
const styles = StyleSheet.create({
     button:{
       backgroundColor: '#392566',
     borderRadius: 20,
     margin: 15,
     width: 120,
     color: '#fff',
     alignItems: 'center',
     justifyContent: 'center',
     height:50, 
   },
     logo: {
     width: 50, 
     height: 50, 
     borderRadius: 22.5, 
     marginRight: 12, 
   },
   headerText: {
     fontSize: 30, 
     fontFamily:'Itim-Regular', 
     color: '#392566', 
   },
   container: {
     flex: 1,
     backgroundColor: colors.background,
   },
   caixa:{
     height:'90%',
     width:'120%',
     backgroundColor: colors.secundary,
     borderRadius:50,
     justifyContent:'center',
     alignItems:'center',
     elevation: 5,
     paddingTop: '10%',
   },
   title: {
     fontSize: 30,
     fontFamily: "Itim-Regular",
     textAlign: 'center',
     color: colors.primary,
     marginBottom: 20,
   },
   formRow: {
     margin: 10,
     flexDirection: "row",
     alignItems: "center",
     borderWidth: 2,
     borderColor: '#d3cfcf',
     borderRadius: 20,
     width: '90%',
     backgroundColor: '#D9D9D9',
   },
   icon: {
     fontSize: 28,
     color: colors.primary,
     padding: 5
   },
   input: {
     fontSize: 18,
     padding: 10,
     width: "70%",
   },
   adoptButtonText: {
     color: '#fff',
     fontSize: 18,
     fontWeight: 'bold',
     fontFamily: 'Itim-regular',
   },
});