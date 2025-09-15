import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "./../navigation/HomeStack";
import CustomHeader from "../components/Header/CustomHeader";

type PetDetailsRouteProp = RouteProp<HomeStackParamList, "PetDetails">;

type PetDetailsNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'PetDetails'>;

type Props = {
  route: PetDetailsRouteProp;
};

export default function PetDetailsScreen({ route }: Props) {

  const { id, title, image, descricao } = route.params;

  const navigation = useNavigation<PetDetailsNavigationProp>();

  const handleAdoptPress = () => {
    
    navigation.navigate('AdoptionMessage');
  };

  return (
    <View style={styles.container}>
      <CustomHeader />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>
          <View style={styles.img}>
            <Image 
              source={typeof image === 'string' ? { uri: image } : image} 
              style={styles.petImage} 
            />
            <Text style={styles.title}>{title}</Text>
          </View>
        
          <View style={styles.caixa}>
            <Text style={styles.descriptionText}>Descrição do pet: {descricao}</Text>
          </View>

          <View style={styles.mapa}>
            <Text style={styles.descriptionText}>Mapa de distância entre o pet e o usuário</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity  onPress={() => navigation.goBack()} style={styles.button}>
              <Text style={styles.adoptButtonText}>Voltar</Text>
            </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAdoptPress}>
          <Text style={styles.adoptButtonText}>Adotar</Text>
        </TouchableOpacity>
         
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
  container: { 
    flex: 1,
    backgroundColor: colors.background, 
  },
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20,
  },
  contentContainer: {
    alignItems: 'center',
    width: '100%',
  },
  img:{
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petImage: {
    height: 200, 
    width: 300,
    borderRadius: 20,
    borderColor: colors.primary,
    borderWidth: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
  },
  title: { 
    fontSize: 35, 
    fontFamily: "Itim-regular",
    marginBottom: 20, 
    fontWeight:'bold',
    marginTop: 15,
  },
  caixa: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secundary,
    borderRadius: 20,
    width: 300,
    minHeight: 100,
    height: 'auto',
    padding: 15,
  },
  mapa: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secundary,
    borderRadius: 20,
    width: 300,
    height: 'auto',
    marginTop: 30,
    padding: 15,
  },
  descriptionText: {
    fontSize: 17, 
    fontFamily: 'Itim-regular'
  },
  footer: {
    padding: 20,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
    
  },
  adoptButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  adoptButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Itim-regular',
  },
});