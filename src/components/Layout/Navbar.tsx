import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import SearchBar from '../Search/SearchBar';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center font-bold text-xl">
            <img 
              src="/logo.svg" 
              alt="Europa Game Price Tracker" 
              className="h-8 w-8 mr-2"
              onError={(e) => {
                // Fallback si el logo no está disponible
                e.currentTarget.style.display = 'none';
              }}
            />
            <span>EuroGameTracker</span>
          </Link>

          {/* Búsqueda en pantallas medianas y grandes */}
          <div className="hidden md:block md:w-1/3">
            <SearchBar />
          </div>

          {/* Menú de navegación en pantallas medianas y grandes */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/search" className="hover:text-primary-200">
              Explorar
            </Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="hover:text-primary-200">
                  Dashboard
                </Link>
                <Link to="/wishlist" className="hover:text-primary-200">
                  Wishlist
                </Link>
                <Link to="/collection" className="hover:text-primary-200">
                  Colección
                </Link>
                <div className="relative group">
                  <button className="flex items-center hover:text-primary-200">
                    <UserCircleIcon className="h-6 w-6 mr-1" />
                    <span>Perfil</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Configuración
                    </Link>
                    <Link 
                      to="/premium" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Premium
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200">
                  Iniciar sesión
                </Link>
                <Link to="/signup" className="bg-white text-primary-700 px-4 py-2 rounded-md font-medium hover:bg-primary-50">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              className="text-white focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-800 px-4 py-3">
          <div className="mb-3">
            <SearchBar />
          </div>
          <div className="flex flex-col space-y-2">
            <Link to="/search" className="hover:text-primary-200 py-2">
              Explorar
            </Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="hover:text-primary-200 py-2">
                  Dashboard
                </Link>
                <Link to="/wishlist" className="hover:text-primary-200 py-2">
                  Wishlist
                </Link>
                <Link to="/collection" className="hover:text-primary-200 py-2">
                  Colección
                </Link>
                <Link to="/settings" className="hover:text-primary-200 py-2">
                  Configuración
                </Link>
                <Link to="/premium" className="hover:text-primary-200 py-2">
                  Premium
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-left hover:text-primary-200 py-2"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary-200 py-2">
                  Iniciar sesión
                </Link>
                <Link to="/signup" className="bg-white text-primary-700 px-4 py-2 rounded-md font-medium hover:bg-primary-50 text-center">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 