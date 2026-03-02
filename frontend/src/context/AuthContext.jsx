import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Ключ для сохранения в localStorage
const STORAGE_KEY = 'shop_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Загружаем пользователя из localStorage при старте
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email, password) => {
    // Проверяем, есть ли пользователь в localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        email: foundUser.email,
        name: foundUser.name,
        balance: foundUser.balance || 1000 // Стартовый баланс 1000
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = (name, email, password) => {
    // Создаем нового пользователя
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Проверяем, не занят ли email
    if (users.some(u => u.email === email)) {
      alert('Пользователь с таким email уже существует');
      return false;
    }
    
    const newUser = {
      name,
      email,
      password,
      balance: 1000, // Начальный баланс
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Сразу логиним
    const userData = {
      email: newUser.email,
      name: newUser.name,
      balance: newUser.balance
    };
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Функция для пополнения баланса
  const addBalance = (amount) => {
    if (!user) return;
    
    const newBalance = user.balance + amount;
    const updatedUser = { ...user, balance: newBalance };
    
    // Обновляем в localStorage пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => {
      if (u.email === user.email) {
        return { ...u, balance: newBalance };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Обновляем текущего пользователя
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
  };

  // Функция для списания баланса (покупка)
  const deductBalance = (amount) => {
    if (!user) return false;
    if (user.balance < amount) {
      alert('Недостаточно средств на балансе');
      return false;
    }
    
    const newBalance = user.balance - amount;
    const updatedUser = { ...user, balance: newBalance };
    
    // Обновляем в localStorage пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map(u => {
      if (u.email === user.email) {
        return { ...u, balance: newBalance };
      }
      return u;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Обновляем текущего пользователя
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout,
      addBalance,
      deductBalance 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}