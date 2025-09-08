import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "./../navigation/stack.routes"
import  CustomHeader from "../components/Header/CustomHeader"
// 🔹 Tipagem da rota PetDetails
type PetDetailsRouteProp = RouteProp<RootStackParamList, "PetDetails">;

type Props = {
  route: PetDetailsRouteProp;
};

export default function PetDetailsScreen({ route }: Props) {
  const { id, title, image, descricao } = route.params; // agora o TS sabe que params existe

  return (
    <View style={styles.container}>
  
      <CustomHeader />

      <View style={ {alignItems: 'center',
    justifyContent: 'center',}}>
      <View style={styles.img}>
       <Image source={typeof image === 'string' ? { uri: image } : image} style={{height:200, width:300,borderRadius:20,    borderColor: colors.primary,
    borderWidth: 2,}} />
    <Text style={styles.title}>{title}</Text>
    </View>
  
      <View style={styles.caixa}>
      <Text style={{margin:15, fontSize:17, fontFamily: 'Itim-regular'}}>Descrição do pet: {descricao}</Text>
      </View>
      </View>
    </View>
  );
}
const colors = {
  background: '#EEE6FF',
  primary: '#392566',
  secundary: '#C8B2F6'
};
const styles = StyleSheet.create({
  img:{
    marginTop: 20,
    borderRadius:20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,

  },
  caixa:
  {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secundary,
    borderRadius: 20,
    width:300,
    height: 'auto'
   

  },
  container: { 
    flex: 1,
     backgroundColor: colors.background, 
     
    },
  title: { fontSize: 35, 
    fontFamily: "Itim-regular",
     marginBottom: 20, 
     fontWeight:'bold',
      marginTop: 15,},
});


