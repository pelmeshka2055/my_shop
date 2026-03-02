import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  // Загружаем заказы пользователя из localStorage
  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = allOrders.filter(order => order.userEmail === user.email);
      setOrders(userOrders);
    } else {
      setOrders([]);
    }
  }, [user]);

  const createOrder = (items, totalAmount) => {
    if (!user) return null;

    const newOrder = {
      id: Date.now(), // простой способ получить уникальный ID
      userEmail: user.email,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount,
      status: 'Оплачен',
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // +3 дня
    };

    // Сохраняем в localStorage
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    allOrders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(allOrders));

    // Обновляем состояние
    setOrders(prev => [...prev, newOrder]);

    return newOrder;
  };

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}