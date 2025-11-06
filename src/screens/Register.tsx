import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Alert, Platform, Image, StyleSheet } from 'react-native';
import { ButtonInterface } from '../components/ButtonInterface';
import { Loading } from '../components/Loading';
import { LoginTypes } from '../navigation/LoginstackNavigation';
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { supabase } from '../core/infra/supabase/client/supabaseClient';

export function RegisterScreen({ navigation }: LoginTypes) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            latitude: 0,
            longitude: 0,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        Alert.alert(
          'Registro Concluído!',
         
        );
        navigation.navigate('Login');
      }
    } catch (err: any) {
      console.error("Erro no registro:", err.message);
      setError(err.message || 'Falha ao registrar usuário.');
      Alert.alert('Erro no Registro', err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, justifyContent: 'center' }}>
          <Image source={require('../../assets/logo_adote.png')} style={styles.logo} />
          <Text style={styles.headerText}>Pet Hug</Text>
        </View>

        <View style={styles.caixa}>
          <Text style={styles.title}>Cadastre-se</Text>

          <View style={styles.formRow}>
            <Ionicons name="person" style={styles.icon} />
            <TextInput
              placeholderTextColor={colors.grey}
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.formRow}>
            <MaterialIcons name="email" style={styles.icon} />
            <TextInput
              placeholderTextColor={colors.grey}
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.formRow}>
            <Entypo name="key" style={styles.icon} />
            <TextInput
              placeholderTextColor={colors.grey}
              style={styles.input}
              placeholder="Senha"
              secureTextEntry={true}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {loading ? (
            <Loading />
          ) : (
            <ButtonInterface title="Salvar" type="secondary" onPress={handleRegister} disabled={loading} />
          )}

          {error && <Text style={{ color: 'red' }}>{error}</Text>}

          <ButtonInterface title="Voltar" type="primary" onPress={() => navigation.navigate('Login')} />
        </View>
      </KeyboardAvoidingView>
  );
}

const colors = {
  background: '#EEE6FF',
  primary: '#392566',
  secundary: '#F4F3F3',
  grey: '#888',

};

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    borderRadius: 22.5,
    marginRight: 12,
    marginTop: 100,
  },
  headerText: {
    fontSize: 30,
    fontFamily: 'Itim-Regular',
    color: '#392566',
    marginTop: 100,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  caixa: {
    width: '90%',
    backgroundColor: colors.secundary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    paddingVertical: 30,
    paddingHorizontal: 15,
    marginTop: 50,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Itim-Regular',
    textAlign: 'center',
    color: colors.primary,
    marginBottom: 20,
  },
  formRow: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d3cfcf',
    borderRadius: 10,
    width: '95%',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  icon: {
    fontSize: 24,
    color: colors.primary,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 50,
    color: '#000',
  },
});
