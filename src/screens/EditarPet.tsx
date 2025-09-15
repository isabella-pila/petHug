
import React, { useState, useEffect } from 'react'; // ✨ Importar useState e useEffect
import { KeyboardAvoidingView, View, Text, TextInput, Platform } from 'react-native';
import { ButtonInterface } from '../components/ButtonInterface';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import CustomHeader from '../components/Header/CustomHeader';
import { RouteProp, useRoute } from '@react-navigation/native'; 
import { AreaPetStackParamList } from '../navigation/AreaPetStack';

// Usaremos os mesmos dados de exemplo para simular a busca no "banco de dados"
const MEUS_PETS_CADASTRADOS = [
  { id: '1', nome: 'Bolinha', foto: 'url_da_foto_1', descricao: 'Um cãozinho muito amigável.' },
  { id: '2', nome: 'Frajola', foto: 'url_da_foto_2', descricao: 'Gato muito esperto e brincalhão.' },
];
type EditarPetScreenRouteProp = RouteProp<AreaPetStackParamList, 'EditarPet'>

export default function EditarPetScreen() {
  const route = useRoute<EditarPetScreenRouteProp>();

  const { petId } = route.params;

  // ✨ Estados para controlar os valores do formulário
  const [nome, setNome] = useState('');
  const [foto, setFoto] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {

    const petParaEditar = MEUS_PETS_CADASTRADOS.find(pet => pet.id === petId);
    if (petParaEditar) {
     
      setNome(petParaEditar.nome);
      setFoto(petParaEditar.foto);
      setDescricao(petParaEditar.descricao);
    }
  }, [petId]); // Executa sempre que o petId mudar

  return (
    <View style={styles.container}>
      <CustomHeader />
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
          <View style={styles.caixa}>
            <Text style={styles.title}>Editar Pet</Text>
            
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
              <Ionicons name="camera-outline" style={styles.icon} />
              <TextInput
                placeholderTextColor={colors.primary}
                style={styles.input}
                placeholder="URL da Foto"
                value={foto} // ✨ Conectar estado
                onChangeText={setFoto} // ✨ Conectar estado
              />
            </View>
            
            <View style={styles.formRow}>
              <Ionicons name="document-text-outline" style={styles.icon} />
              <TextInput
                placeholderTextColor={colors.primary}
                style={styles.input}
                placeholder="Descrição"
                value={descricao} // ✨ Conectar estado
                onChangeText={setDescricao} // ✨ Conectar estado
              />
            </View>
            
            <ButtonInterface title='Salvar Alterações' type='primary' onPress={() => {
             
              console.log('Salvando:', { id: petId, nome, foto, descricao });
            }} />
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

const styles = StyleSheet.create({
  
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

    height:'80%',
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
});