import { StyleSheet } from 'react-native';

const colors = {
  background: '#EEE6FF',
  primary: '#392566',
};
export const styles = StyleSheet.create({
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    margin: 15,
    width: 200,
    
  },
  buttonSecondary: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    margin: 10,
    width: 200,
    
  },
  buttonThird: {
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 10,
  },
  text: {
    color: '#fff',
    fontWeight: "bold",
    padding: 10,
    fontSize: 18,
    textAlign: "center"
  }
})