import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user, deductBalance } = useAuth();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Корзина пуста
          </h2>
          <p className="text-gray-600 mb-6">
            Добавьте товары в корзину, чтобы оформить заказ
          </p>
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Продолжить покупки
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    if (!user) {
      alert('Необходимо войти в систему');
      navigate('/auth');
      return;
    }

    if (user.balance < totalPrice) {
      alert('Недостаточно средств на балансе. Пожалуйста, пополните баланс в профиле.');
      navigate('/profile');
      return;
    }

    setIsCheckingOut(true);

    // Списываем деньги
    if (deductBalance(totalPrice)) {
      // Создаем заказ
      createOrder(cart, totalPrice);
      
      // Очищаем корзину
      clearCart();
      
      alert('Заказ успешно оформлен!');
      navigate('/profile');
    }

    setIsCheckingOut(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Корзина</h2>
      
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-full sm:w-24 h-24 object-cover rounded-lg"
            />
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.price} ₽</p>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                  disabled={isCheckingOut}
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                  disabled={isCheckingOut}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-col items-end justify-between">
              <p className="text-xl font-bold text-blue-600">
                {item.price * item.quantity} ₽
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 transition text-sm"
                disabled={isCheckingOut}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Информация о балансе */}
      {user && (
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Ваш баланс:</span>
            <span className={`font-bold text-lg ${
              user.balance >= totalPrice ? 'text-green-600' : 'text-red-600'
            }`}>
              {user.balance} ₽
            </span>
          </div>
        </div>
      )}
      
      {/* Итого и оформление */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg text-gray-600">Итого:</span>
          <span className="text-2xl font-bold text-blue-600">
            {totalPrice} ₽
          </span>
        </div>
        
        {!user ? (
          <div className="text-center">
            <p className="text-red-500 mb-3">Для оформления заказа необходимо войти</p>
            <Link
              to="/auth"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              Войти
            </Link>
          </div>
        ) : user.balance < totalPrice ? (
          <div className="text-center">
            <p className="text-red-500 mb-3">Недостаточно средств</p>
            <Link
              to="/profile"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-lg font-semibold"
            >
              Пополнить баланс
            </Link>
          </div>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isCheckingOut ? 'Оформление...' : 'Оформить заказ'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Cart;