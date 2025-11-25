import React, { useState, useMemo, useCallback } from 'react';
import { View, StyleSheet, FlatList, Text, ActivityIndicator } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { HighLight } from "../components/HighLight";
import { CategoryFilter } from '../components/category/CategoryFilter';
import CustomHeader from '../components/Header/CustomHeader';
import { makePetPerfilUseCases } from '../core/factories/MakePetPerfilRepository';
import { PetPerfil } from '../core/domain/entities/PetPerfil';

const colors = {
  background: '#EEE6FF',
  primary: '#392566',
};



export default function HomeScreen() {

  const [pets, setPets] = useState<PetPerfil[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('todos');


  const { findAllPets } = makePetPerfilUseCases();

  useFocusEffect(
    useCallback(() => {
      const carregarTodosOsPets = async () => {
        setLoading(true);
        setError(null);
        try {
          const todosOsPets = await findAllPets.execute();
          setPets(todosOsPets);
        } catch (err) {
          setError('Não foi possível carregar os pets.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      carregarTodosOsPets();
    }, [])
  );
  const filteredData = useMemo(() => {
    if (selectedCategory === 'todos') {
      return pets;
    }
  
    return pets.filter(pet => pet.category === selectedCategory);
  }, [selectedCategory, pets]);


  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.emptyText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader />
      <View style={{ alignItems: 'center',  }}>
        <Text style={styles.textoAdocao}>Filtre pela sua preferência pet</Text>
      </View>

      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Text style={styles.textoAdocao}>Animais disponíveis para adoção:</Text>
      </View>
      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          
          <HighLight
            id={item.id}
            title={item.name.value}
            
            image={{ uri: item.foto.url }}
        
            category={item.category || 'cachorro'}
            descricao={item.descricao}
            donoId={item.donoId}
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    marginLeft: 15,
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  textoAdocao: {
    fontSize: 23,
    fontFamily: 'Itim-Regular',
    color: colors.primary,
  },
  emptyContainer: {
    flex: 1,
    width: '100%', // Garante que o container ocupe a largura
    marginTop: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Itim-Regular',
    color: colors.primary,
  },
});