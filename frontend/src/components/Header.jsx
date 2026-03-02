import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

function Header() {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Фруктовая лавка
          </Link>

          {/* Десктопное меню */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
              Главная
            </Link>
            
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 transition relative">
              🛒 Корзина
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {user ? (
              <>
                {/* Вот ЭТОТ блок с балансом */}
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition flex items-center gap-2">
                  <span>{user.name}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-semibold">
                    {user.balance} ₽
                  </span>
                </Link>
                <button
                  onClick={logout}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Войти
              </Link>
            )}
          </nav>

          {/* Мобильное меню (бургер) */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Мобильное выпадающее меню */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              
              <Link
                to="/cart"
                className="text-gray-700 hover:text-blue-600 transition px-2 py-1 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                🛒 Корзина
                {getTotalItems() > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {getTotalItems()}
                  </span>
                )}
              </Link>

              {user ? (
                <>
                  {/* И в мобильном меню тоже добавляем баланс */}
                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-blue-600 transition px-2 py-1 flex items-center justify-between"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{user.name}</span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-sm font-semibold">
                      {user.balance} ₽
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-red-500 hover:text-red-700 transition text-left px-2 py-1"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Войти
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;