import React from "react";
import { View, Text, StyleSheet,Pressable } from "react-native";
import CustomHeader from "../components/Header/CustomHeader";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/stack.routes";

type NavProp = NativeStackNavigationProp<RootStackParamList, "MainTabs">;


export default function AreaPetScreen() {

  const navigation = useNavigation<NavProp>();
  
  return (
    
    <View style={styles.container}>
      <CustomHeader />
      <View style={styles.tela} >
      <Pressable onPress={() => navigation.navigate("CadastrarPet")} style={styles.button}>  
        <Text style={styles.text}>Cadastrar Pet</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('EditarPet')} style={styles.button}>  
        <Text style={styles.text}>Editar Pet</Text>
      </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE6FF',

    
  },
  text: { fontSize: 20, fontWeight: "bold", color:'#fff'},
  button:{
    width:200,
    height:60,
    backgroundColor:'#392566',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
    

  },
  tela: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:100,
    gap:20,
    
  }
});
