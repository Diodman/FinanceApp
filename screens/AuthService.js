import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthService = {
  register: async (email, password) => {
    try {
      const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
      const existingUser = users.find((user) => user.email === email);
      if (existingUser) {
        throw new Error('Пользователь с таким email уже существует');
      }
      const newUser = { email, password, budget: 0 };
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      throw error;
    }
  },
  
  login: async (email, password) => {
    // Получаем данные пользователя из хранилища
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
        const { email: storedEmail, password: storedPassword } = JSON.parse(userData);
        // Проверяем, совпадают ли введенные значения с сохраненными данными
        if (email === storedEmail && password === storedPassword) {
            return true; // Успешный вход
        }
    }
    return false; // Неверный email или пароль, либо пользователь не найден
  },
  
  logout: async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Ошибка при выходе из аккаунта:', error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const currentUser = JSON.parse(await AsyncStorage.getItem('currentUser'));
      return currentUser;
    } catch (error) {
      console.error('Ошибка при получении текущего пользователя:', error);
      throw error;
    }
  },
  
  updateCurrentUser: async (updatedUser) => {
    try {
      const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
      const userIndex = users.findIndex((user) => user.email === updatedUser.email);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        await AsyncStorage.setItem('users', JSON.stringify(users));
        await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
      throw error;
    }
  }
};

export default AuthService;
