import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import AuthService from '../screens/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [budget, setBudget] = useState(0);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Введите email и пароль');
      return;
    }

    try {
      await AuthService.register(email, password, budget);
      Alert.alert('Успешно', 'Вы успешно зарегистрировались');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Ошибка', error.message);
    }
  };

  return (
    <LinearGradient colors={['#3498db', '#9b59b6']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Регистрация</Text>
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
        <View style={styles.inputContainer}>
         <Icon name="wallet" type="entypo" color="#517fa4" size={40} />
          <TextInput
            style={styles.input}
            placeholder="Бюджет"
            placeholderTextColor="#ccc"
            value={String(budget)}
            onChangeText={text => setBudget(Number(text))}
            keyboardType="numeric"
          />
        </View>
        <Button
          title="Зарегистрироваться"
          buttonStyle={styles.button}
          onPress={handleRegister}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Уже есть аккаунт? Войти</Text>
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
  loginText: {
    marginTop: 16,
    color: '#fff',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
