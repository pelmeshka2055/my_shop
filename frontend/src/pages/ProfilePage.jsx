import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const { user, addBalance } = useAuth();
  const { orders } = useOrders();
  const [amount, setAmount] = useState('');

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Необходимо войти в систему
        </h2>
        <Link to="/auth" className="text-blue-600 hover:text-blue-800">
          Перейти к авторизации
        </Link>
      </div>
    );
  }

  const handleAddBalance = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (num > 0) {
      addBalance(num);
      setAmount('');
      alert(`Баланс пополнен на ${num} ₽`);
    }
  };

  const quickAdd = (sum) => {
    addBalance(sum);
    alert(`Баланс пополнен на ${sum} ₽`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Личный профиль</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Информация о пользователе */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          {/* Баланс */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Текущий баланс:</span>
              <span className="text-2xl font-bold text-green-600">
                {user.balance} ₽
              </span>
            </div>
          </div>
        </div>

        {/* Пополнение баланса */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Пополнить баланс</h3>
          
          <form onSubmit={handleAddBalance} className="mb-4">
            <div className="flex gap-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Сумма"
                min="1"
                className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Пополнить
              </button>
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => quickAdd(100)}
              className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition"
            >
              +100 ₽
            </button>
            <button
              onClick={() => quickAdd(500)}
              className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition"
            >
              +500 ₽
            </button>
            <button
              onClick={() => quickAdd(1000)}
              className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition"
            >
              +1000 ₽
            </button>
            <button
              onClick={() => quickAdd(5000)}
              className="bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition"
            >
              +5000 ₽
            </button>
          </div>
        </div>

        {/* История заказов */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">История заказов</h3>
          
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">У вас пока нет заказов</p>
              <Link
                to="/"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Перейти к покупкам
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-sm text-gray-500">Заказ №{order.id}</span>
                      <p className="text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-green-600">
                        {order.totalAmount} ₽
                      </span>
                      <p className="text-sm text-gray-500">{order.status}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <p className="text-sm font-medium mb-2">Товары:</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span className="font-medium">
                            {item.price * item.quantity} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;