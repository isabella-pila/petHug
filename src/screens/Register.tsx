import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, Alert, Platform, Image, StyleSheet } from 'react-native';
import { ButtonInterface } from '../components/ButtonInterface';
import { Loading } from '../components/Loading';
import { LoginTypes } from '../navigation/LoginstackNavigation';
import { MaterialIcons, Entypo, Ionicons } from "@expo/vector-icons";
import { supabase } from '../core/infra/supabase/client/supabaseClient';
import * as Location from 'expo-location';


export function RegisterScreen({ navigation }: LoginTypes) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
   
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }


    if (password.length < 8) {
      Alert.alert('Senha Fraca', 'A senha deve ter pelo menos 8 caracteres.');
      return;
    }

    // (Removi a validação de formato de email, conforme pedido)

    setLoading(true);
    setError(null);

    try {
      // 📍 PERMISSÃO DE LOCALIZAÇÃO
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Erro", "Permissão de localização negada.");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      // 📌 REGISTRO NO SUPABASE
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            name: name.trim(),
            latitude, 
            longitude, 
          },
        },
      });

      if (signUpError) throw signUpError;

      // Se deu certo, salva na tabela pública também (Recomendado)
      if (data.user) {
         const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name: name.trim(),
            email: email.trim(),
            location_lat: latitude,
            location_lng: longitude
          });
          
          if (profileError) console.log("Erro ao salvar perfil público:", profileError);

        Alert.alert("Sucesso!", "Cadastro realizado.", [
            { text: "OK", onPress: () => navigation.navigate('Login') }
        ]);
      }

    } catch (err: any) {
      console.error("Erro no registro:", err.message);
      setError(err.message);
      Alert.alert('Erro', err.message);
    } finally {
      setLoading(false);
    }
  }

  
  return (
   

    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
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
