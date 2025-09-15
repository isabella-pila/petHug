import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text } from "react-native";
import { HighLight } from "../components/HighLight";
import { CategoryFilter } from '../components/category/CategoryFilter'; 
import CustomHeader from '../components/Header/CustomHeader';
import { useAuth } from "../context/auth";
const colors = {
  background: '#EEE6FF',
  primary: '#392566',
};

const PETS_DATA = [
  { id: '1', title: 'Chica', category: 'cachorro', image: require('../../assets/chica.jpg'), descricao: "Tenho 3 anos, sou porte pequeno e adoro brincar, correr e pular. Sou uma cadelinha com muita energia que precisa de espaço para brincar." },
    { id: '2', title: 'Lila', category: 'cachorro', image: require('../../assets/Lila.jpg'), descricao: "Tenho 6 anos, sou porte pequeno uma idosa que so dorme, e muito carinhosa." },
      { id: '3', title: 'Nala', category: 'cachorro', image: require('../../assets/nala.jpg'), descricao: "Tenho 1 aninho. Sou uma filhotona que adora carinho e brincar de buscar a bolinha. Sou da raça Dachshund de porte pequeno." },
        { id: '4', title: 'Juju', category: 'outros', image: require('../../assets/juju.jpg'), descricao: "Tenho 3 anos, sou uma galinha gigante e gorda so penso em comer o dia todo, sou bem mansa" },
          { id: '5', title: 'Lilith', category: 'gato', image: require('../../assets/lilith.jpg'), descricao: "Tenho 4 anos, sou uma gatinha muito fofinha e gosto de carinhos" },
            { id: '6', title: 'Symon', category: 'cachorro', image: require('../../assets/symon.jpg'), descricao: "Tenho 7 anos, sou um cachorro que gosta de bolinhas e ficar bricando o dia todo" },
]

export default function HomeScreen() {
  const {setLogin} = useAuth()

  const [selectedCategory, setSelectedCategory] = useState('todos');

  const filteredData = useMemo(() => {
    if (selectedCategory === 'todos') {
      return PETS_DATA; 
    }
    return PETS_DATA.filter(pet => pet.category === selectedCategory);
  }, [selectedCategory]); 

  return (
    <View style={styles.container}>
      <CustomHeader />
       <View style={{ alignItems:'center', marginTop:10}}>
      <Text style={styles.textoAdocao}>Filtre pela sua preferência pet</Text>
      </View>

      <CategoryFilter 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <View style={{ alignItems:'center', marginTop:10}}>
      <Text style={styles.textoAdocao}>Animais disponíveis para adoção:</Text>
      </View>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <HighLight
            id={item.id}
            title={item.title}
            image={item.image}
            category={item.category}
            descricao={item.descricao}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum pet encontrado. 🐾</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,

  
  },
  gridContainer: {
    marginLeft:15,
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  textoAdocao:{
    fontSize:23,
    fontFamily:'Itim-Regular',
    color:colors.primary,
  

  },

  emptyContainer: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily:'Itim-Regular',
    color: colors.primary,
  },
});