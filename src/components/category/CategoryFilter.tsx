import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const colors = {
  primary: '#392566',
  text: '#333',
  background: '#FFFFFF',
  selectedBorder: '#7D52F6',
};

const CATEGORIES = [
  { key: 'todos', label: 'Todos', iconUrl: 'https://em-content.zobj.net/source/microsoft/379/paw-prints_1f43e.png' },
  { key: 'gato', label: 'Gato', iconUrl: 'https://res.cloudinary.com/dtwruiuyw/image/upload/v1756985362/gatinho_ol81rl.png' },
  { key: 'cachorro', label: 'Cachorro', iconUrl: 'https://res.cloudinary.com/dtwruiuyw/image/upload/v1756985362/cachorrinho_xfczvr.png' },
  { key: 'outros', label: 'Outros', iconUrl: 'https://res.cloudinary.com/dtwruiuyw/image/upload/v1756985362/passarinho_bbkaaz.png' },
];

// 👇 1. Definimos um "tipo" para as props do nosso componente
type CategoryFilterProps = {
  selectedCategory: string;
  onSelectCategory: (categoryKey: string) => void; // A prop é uma função que recebe uma string e não retorna nada
};

// 👇 2. Aplicamos o tipo às props na declaração da função
export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <View style={styles.filterContainer}>
      {CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.key}
          style={[
            styles.filterButton,
            selectedCategory === category.key && styles.selectedFilter,
          ]}
          onPress={() => onSelectCategory(category.key)}
        >
          <Image source={{ uri: category.iconUrl }} style={styles.filterIcon} />
          <Text style={styles.filterText}>{category.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#EEE6FF'
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFilter: {
    borderColor: colors.selectedBorder,
    borderWidth: 3,
  },
  filterIcon: {
    width: 40,
    height: 40,
  },
  filterText: {
    fontSize: 12,
    fontFamily:'Itim-Regular',
    color: colors.text,
    marginTop: 2,
  },
});