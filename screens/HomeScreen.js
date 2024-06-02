import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import AuthService from '../screens/AuthService';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [dailySpend, setDailySpend] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        calculateDailySpend(currentUser.budget);
      }
    };
  
    // Функция для обновления данных бюджета при каждом входе на экран
    const updateBudgetOnFocus = navigation.addListener('focus', () => {
      fetchData();
    });
  
    // Отписываемся от слушателя при размонтировании компонента
    return updateBudgetOnFocus;
  }, [navigation]);
  

  const calculateDailySpend = (budget) => {
    const currentDate = new Date();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const remainingDays = daysInMonth - currentDate.getDate() + 1;
    setDailySpend(budget / remainingDays);
  };

  return (
    <LinearGradient colors={['#3498db', '#9b59b6']} style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Budget')}>
        <Text style={styles.title}>Ваш общий бюджет</Text>
        <View style={styles.budgetContainer}>
          <Icon name="wallet" type="entypo" color="#517fa4" size={40} />
          <Text style={styles.budgetText}>{user ? user.budget : 0} ₽</Text>
        </View>
        <Text style={styles.dailySpendText}>Средняя сумма на день: {dailySpend.toFixed(2)} ₽</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Savings')}>
        <Text style={styles.title}>Ваши накопления</Text>
        <View style={styles.budgetContainer}>
          <Icon name="wallet" type="entypo" color="#517fa4" size={40} />
          <Text style={styles.budgetText}>{user ? user.savings : 100} ₽</Text>
        </View>
        <Text style={styles.goalText}>Цель: {user ? user.goal : 100} ₽</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  budgetContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },

  budgetText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#517fa4',
    marginLeft: 10,
  },
  dailySpendText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
  goalText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
  },
});

export default HomeScreen;
