// LoginScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import AuthService from '../screens/AuthService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Введите email и пароль');
      return;
    }

    const loggedIn = await AuthService.login(email, password);
    if (loggedIn) {
      navigation.navigate('Home');
    } else {
      Alert.alert('Ошибка', 'Неверный email или пароль');
    }
  };

  return (
    <LinearGradient colors={['#3498db', '#9b59b6']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Мои финансы</Text>
        <View style={styles.inputContainer}>
          <Icon name="envelope" type="font-awesome" color="#517fa4" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" type="font-awesome" color="#517fa4" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <Button
          title="Войти"
          buttonStyle={styles.button}
          onPress={handleLogin}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Registr')}>
          <Text style={styles.registerText}>Регистрация</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#fff',
  },
  button: {
    backgroundColor: '#517fa4',
    borderRadius: 10,
    marginTop: 20,
  },
  registerText: {
    marginTop: 16,
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
