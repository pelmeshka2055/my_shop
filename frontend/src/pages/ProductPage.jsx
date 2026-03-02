import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProductPage() {
  const { id } = useParams();
  const { getProduct } = useProducts();
  const { addToCart } = useCart();
  const { user, deductBalance } = useAuth();
  const { createOrder } = useOrders();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    const data = await getProduct(id);
    setProduct(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Загрузка...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Товар не найден</h2>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert('Товар добавлен в корзину!');
  };

  const handleBuyNow = async () => {
    if (!user) {
      alert('Необходимо войти в систему');
      return;
    }

    setIsBuying(true);
    
    if (await deductBalance(product.price)) {
      const orderItems = [{
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }];
      
      await createOrder(orderItems, product.price);
      alert(`Поздравляем! Вы купили ${product.name} за ${product.price} ₽`);
    }
    
    setIsBuying(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          
          <div className="md:w-1/2 p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {product.name}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {product.description}
            </p>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-blue-600">
                {product.price} ₽
              </span>
            </div>

            {user && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ваш баланс:</span>
                  <span className={`font-bold text-lg ${
                    user.balance >= product.price ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.balance} ₽
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
              >
                В корзину
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={!user || user.balance < product.price || isBuying}
                className={`flex-1 px-6 py-3 rounded-lg transition text-lg font-semibold ${
                  !user || user.balance < product.price
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {!user 
                  ? 'Войдите для покупки'
                  : user.balance < product.price
                    ? 'Недостаточно средств'
                    : isBuying
                      ? 'Покупка...'
                      : 'Купить сейчас'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;