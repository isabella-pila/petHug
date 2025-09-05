import React from "react";
import { View, Text, StyleSheet,Pressable } from "react-native";
import CustomHeader from "../components/Header/CustomHeader";
import { useNavigation } from '@react-navigation/native';
export default function AreaPetScreen() {
  return (
    
    <View style={styles.container}>
      <CustomHeader />
      <View style={styles.tela} >
      <Pressable onPress={() => {}} style={styles.button}>  
        <Text style={styles.text}>Cadastrar Pet</Text>
      </Pressable>
      <Pressable onPress={() => {}}>  
        <Text>Editar Pet</Text>
      </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE6FF',
    paddingTop: 50
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
  }
});
