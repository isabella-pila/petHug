import { StyleSheet } from 'react-native';

const colors = {
  background: '#EEE6FF',
  primary: '#392566',
};
export const styles = StyleSheet.create({
  base: {
    borderRadius: 5,
    margin: 10,
    padding: 10
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.primary,
  },
  third: {
    backgroundColor: colors.primary,
  },
  danger: {
    backgroundColor: colors.background
  },
  text: {
    color: '#fff',
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  },
  contentRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  iconContainer: { 
    marginHorizontal: 4,
    padding: 2,
    color: '#fff'
  }
})