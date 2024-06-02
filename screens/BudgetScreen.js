import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AuthService from '../screens/AuthService';

const BudgetScreen = () => {
  const navigation = useNavigation();
  const onSwipeLeft = (gestureState) => {
    navigation.goBack();
  };

  const [user, setUser] = useState(null);
  const [expense, setExpense] = useState('');
  const [income, setIncome] = useState('');
  const [budget, setBudget] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [dailySpend, setDailySpend] = useState(0);
  const today = new Date().toISOString().split('T')[0];

  // В useEffect сохраняем данные
useEffect(() => {
    const saveData = async () => {
      if (user) {
        await AsyncStorage.setItem(`transactions_${user.email}`, JSON.stringify(transactions));
        await AsyncStorage.setItem(`budget_${user.email}`, JSON.stringify(budget));
      }
    };
    saveData();
  }, [transactions, budget]);
  
  // В useEffect извлекаем данные
  useEffect(() => {
    const fetchData = async () => {
      const currentUser = await AuthService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const storedTransactions = JSON.parse(await AsyncStorage.getItem(`transactions_${currentUser.email}`)) || [];
        const storedBudget = JSON.parse(await AsyncStorage.getItem(`budget_${currentUser.email}`)) || 0;
        setTransactions(storedTransactions);
        setBudget(storedBudget);
        calculateDailySpend(storedBudget);
      }
    };
    fetchData();
  }, []);
  

  useEffect(() => {
    const calculateDailySpend = () => {
      if (budget === 0) return; // Добавляем проверку на ноль, чтобы избежать деления на ноль
      const currentDate = new Date();
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      const remainingDays = daysInMonth - currentDate.getDate() + 1;
      setDailySpend(budget / remainingDays);
    };

    calculateDailySpend();
  }, [budget]);

  const handleAddExpense = () => {
    if (expense) {
      const newExpense = {
        date: today,
        type: 'expense',
        amount: parseFloat(expense),
      };
      setTransactions([...transactions, newExpense]);
      setBudget(budget - parseFloat(expense));
      setExpense('');
    }
  };

  const handleAddIncome = () => {
    if (income) {
      const newIncome = {
        date: today,
        type: 'income',
        amount: parseFloat(income),
      };
      setTransactions([...transactions, newIncome]);
      setBudget(budget + parseFloat(income));
      setIncome('');
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transaction}>
      <Text style={styles.transactionText}>{item.date}</Text>
      <Text style={[styles.transactionText, item.type === 'income' ? styles.income : styles.expense]}>
        {item.type === 'income' ? '+' : '-'}{item.amount} ₽
      </Text>
    </View>
  );

  return (
    <LinearGradient colors={['#3498db', '#9b59b6']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Текущий бюджет: {budget} ₽</Text>
          <Text style={styles.dailySpend}>Средняя сумма на день: {dailySpend.toFixed(2)} ₽</Text>
        </View>
        <FlatList
          data={transactions.filter(transaction => transaction.date === today)}
          renderItem={renderTransaction}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
        />
        <View style={styles.table}>
          <View style={styles.inputContainer}>
            <Icon name="minus" type="font-awesome" color="#e74c3c" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Добавить расход"
              placeholderTextColor="#ccc"
              value={expense}
              onChangeText={setExpense}
              keyboardType="numeric"
            />
          </View>
          <Button
            title="Добавить"
            buttonStyle={[styles.button, styles.expenseButton]}
            onPress={handleAddExpense}
          />
          <View style={styles.inputContainer}>
            <Icon name="plus" type="font-awesome" color="#2ecc71" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Добавить доход"
              placeholderTextColor="#ccc"
              value={income}
              onChangeText={setIncome}
              keyboardType="numeric"
            />
          </View>
          <Button
            title="Добавить"
            buttonStyle={[styles.button, styles.incomeButton]}
            onPress={handleAddIncome}
          />
        </View>
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
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  dailySpend: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  list: {
    marginBottom: 20,
  },
  table: {
    flexDirection: 'column',
    alignItems: 'center',
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
expenseButton: {
  backgroundColor: '#e74c3c',
},
incomeButton: {
  backgroundColor: '#2ecc71',
},
transaction: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#ccc',
},
transactionText: {
  fontSize: 16,
  color: '#fff',
},
income: {
  color: '#2ecc71',
},
expense: {
  color: '#e74c3c',
},
});

export default BudgetScreen;
