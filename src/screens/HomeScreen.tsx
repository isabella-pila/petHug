// src/screens/HomeScreen.tsx

import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Text } from "react-native";
import { HighLight } from "../components/HighLight";
import { CategoryFilter } from '../components/category/CategoryFilter'; 
import CustomHeader from '../components/Header/CustomHeader';

const colors = {
  background: '#EEE6FF',
  primary: '#392566',
};

// Seus dados estão corretos, misturando require e strings
const PETS_DATA = [
  { id: '1', title: 'Frajola', category: 'gato', image: require('../../assets/Lila.jpg'), descricao: "blablabla leyeyeyeyyeyeyyeyyeyyeyeyeyyeyeyyeyeyyeyeyeyyeyeeyeyye" },
  { id: '2', title: 'Lila', category: 'cachorro', image: 'https://res.cloudinary.com/dtwruiuyw/image/upload/v1756996038/Lila_carqsz.jpg',descricao: "blablabla" },
  { id: '3', title: 'Piu-Piu', category: 'outros', image: 'https://res.cloudinary.com/dtwruiuyw/image/upload/v1677872608/pwmllcaxpl5foknnqdz9.png',descricao: "blablabla" },
  // ... resto dos dados
];

export default function HomeScreen() {
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