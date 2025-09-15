import React from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Platform, Image, TouchableOpacity } from 'react-native';
import { ButtonInterface } from '../components/ButtonInterface';
import { Entypo, EvilIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import CustomHeader from '../components/Header/CustomHeader';
import { useNavigation } from '@react-navigation/native';
export default function CadastrarPetScreen() {
  const navigation = useNavigation();
  return (
    
   <View style={styles.container}>
    <CustomHeader />
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      
       <View style={styles.caixa}>
        <Text style={styles.title}>Cadastar Pet</Text>
        <View style={styles.formRow}>
          <Ionicons name="paw-outline" style={styles.icon} />
          <TextInput
            placeholderTextColor={colors.primary}
            style={styles.input}
            placeholder="Nome"
          />
        </View>
        <View style={styles.formRow}>
          <EvilIcons name="camera" style={styles.icon} />
          <TextInput
            placeholderTextColor={colors.primary}
            style={styles.input}
            placeholder="Foto"
          />
        </View>
        <View style={styles.formRow}>
           <Ionicons name="paw-outline" style={styles.icon} />
          <TextInput
            placeholderTextColor={colors.primary}
            style={styles.input}
            placeholder="Descrição"
          />
        </View>
        <ButtonInterface title='Cadastrar' type='primary' onPress={()=> []} />
   <TouchableOpacity  onPress={() => navigation.goBack()} style={styles.button}>
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