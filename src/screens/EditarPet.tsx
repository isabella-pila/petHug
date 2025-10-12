import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Platform, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { ButtonInterface } from '../components/ButtonInterface';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../components/Header/CustomHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { AreaPetStackParamList } from '../navigation/AreaPetStack';
import { makePetPerfilUseCases } from '../core/factories/MakePetPerfilRepository';

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
                category: category, // ✨ Envia a categoria para o use case
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

                        {/* ✨ Novo campo de Categoria */}
                        <View style={styles.formRow}>
                            <Ionicons name="apps-outline" style={styles.icon} />
                            <TextInput placeholderTextColor={colors.primary} style={styles.input} placeholder="Categoria (cachorro, gato, outros)" value={category} onChangeText={setCategory}/>
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

// ...Seus estilos...
const colors = {
  background: '#EEE6FF',
  primary: '#392566',
  secundary: '#F4F3F3'
};
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