import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavingsScreen = () => {
  const [savings, setSavings] = useState(500);
  const [goal, setGoal] = useState('1000');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const storedSavings = await AsyncStorage.getItem('savings');
      const storedGoal = await AsyncStorage.getItem('goal');
      if (storedSavings) {
        setSavings(parseFloat(storedSavings));
      }
      if (storedGoal) {
        setGoal(storedGoal);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      await AsyncStorage.setItem('savings', savings.toString());
      await AsyncStorage.setItem('goal', goal);
    };

    saveData();
  }, [savings, goal]);

  const handleAddSavings = () => {
    const newSavings = savings + parseFloat(amount);
    setSavings(newSavings);
    setAmount('');
  };

  const handleRemoveSavings = () => {
    const newSavings = savings - parseFloat(amount);
    setSavings(newSavings);
    setAmount('');
  };

  return (
    <LinearGradient colors={['#3498db', '#9b59b6']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Ваши накопления: {savings} ₽</Text>
        <View style={styles.inputContainer}>
          <Icon name="plus" type="font-awesome" color="#2ecc71" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Сумма"
            placeholderTextColor="#ccc"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
        <Button
          title="Добавить накопления"
          buttonStyle={[styles.button, styles.addButton]}
          onPress={handleAddSavings}
        />
        <Button
          title="Убрать накопления"
          buttonStyle={[styles.button, styles.removeButton]}
          onPress={handleRemoveSavings}
        />
        <View style={styles.inputContainer}>
          <Icon name="bullseye" type="font-awesome" color="#3498db" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Цель накоплений"
            placeholderTextColor="#ccc"
            value={goal}
            onChangeText={setGoal}
          />
        </View>
        <Text style={styles.goalText}>Цель: {goal}</Text>
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
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 12,
    width: '100%',
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
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
  },
  addButton: {
    backgroundColor: '#2ecc71',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
  },
  goalText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SavingsScreen;
