import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon,
  UserIcon,
  HeartIcon,
  CollectionIcon,
  SearchIcon,
  HomeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logOut } = useAuth();
  const location = useLocation();

  // Detectar scroll para aplicar glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav 
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-dark py-2 shadow-lg' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-extrabold text-xl gradient-text">
                COLEXALIA
              </span>
            </div>
          </Link>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={({isActive}) => 
              `text-sm font-medium ${isActive ? 'text-primary-500' : 'text-gray-600 hover:text-primary-600'} transition-colors`
            }>
              <span className="flex items-center"><HomeIcon className="w-4 h-4 mr-1" /> Inicio</span>
            </NavLink>
            <NavLink to="/search" className={({isActive}) => 
              `text-sm font-medium ${isActive ? 'text-primary-500' : 'text-gray-600 hover:text-primary-600'} transition-colors`
            }>
              <span className="flex items-center"><SearchIcon className="w-4 h-4 mr-1" /> Explorar</span>
            </NavLink>
            <NavLink to="/premium" className={({isActive}) => 
              `text-sm font-medium ${isActive ? 'text-accent-500' : 'text-gray-600 hover:text-accent-600'} transition-colors`
            }>
              <span className="flex items-center"><ChartBarIcon className="w-4 h-4 mr-1" /> Premium</span>
            </NavLink>
            
            {currentUser ? (
              <div className="relative group">
                <div className="flex items-center space-x-1 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    <UserIcon className="w-5 h-5 text-gray-700" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">Mi cuenta</span>
                </div>
                
                <div className="absolute right-0 mt-2 w-48 glass-dark border border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                  <div className="py-1 px-2">
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-200 rounded-lg hover:bg-gray-700 transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-200 rounded-lg hover:bg-gray-700 transition-colors">
                      <span className="flex items-center"><HeartIcon className="w-4 h-4 mr-1" /> Mi Wishlist</span>
                    </Link>
                    <Link to="/collection" className="block px-4 py-2 text-sm text-gray-200 rounded-lg hover:bg-gray-700 transition-colors">
                      <span className="flex items-center"><CollectionIcon className="w-4 h-4 mr-1" /> Mi Colección</span>
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-200 rounded-lg hover:bg-gray-700 transition-colors">
                      Configuración
                    </Link>
                    <hr className="my-1 border-gray-600" />
                    <button 
                      onClick={logOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-200 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth/login" className="px-4 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/auth/signup" className="px-4 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 glass rounded-xl">
            <div className="flex flex-col space-y-2 px-4">
              <NavLink to="/" className={({isActive}) => 
                `px-3 py-2 rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`
              }>
                <span className="flex items-center"><HomeIcon className="w-5 h-5 mr-2" /> Inicio</span>
              </NavLink>
              <NavLink to="/search" className={({isActive}) => 
                `px-3 py-2 rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`
              }>
                <span className="flex items-center"><SearchIcon className="w-5 h-5 mr-2" /> Explorar</span>
              </NavLink>
              <NavLink to="/premium" className={({isActive}) => 
                `px-3 py-2 rounded-lg ${isActive ? 'bg-accent-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`
              }>
                <span className="flex items-center"><ChartBarIcon className="w-5 h-5 mr-2" /> Premium</span>
              </NavLink>
              
              {currentUser ? (
                <>
                  <hr className="border-gray-200 my-2" />
                  <NavLink to="/dashboard" className={({isActive}) => 
                    `px-3 py-2 rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`
                  }>
                    <span className="flex items-center"><UserIcon className="w-5 h-5 mr-2" /> Dashboard</span>
                  </NavLink>
                  <NavLink to="/wishlist" className={({isActive}) => 
                    `px-3 py-2 rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`
                  }>
                    <span className="flex items-center"><HeartIcon className="w-5 h-5 mr-2" /> Mi Wishlist</span>
                  </NavLink>
                  <NavLink to="/collection" className={({isActive}) => 
                    `px-3 py-2 rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`
                  }>
                    <span className="flex items-center"><CollectionIcon className="w-5 h-5 mr-2" /> Mi Colección</span>
                  </NavLink>
                  <NavLink to="/settings" className={({isActive}) => 
                    `px-3 py-2 rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'text-gray-800 hover:bg-gray-100'}`
                  }>
                    Configuración
                  </NavLink>
                  <button 
                    onClick={logOut}
                    className="px-3 py-2 text-left rounded-lg text-gray-800 hover:bg-gray-100"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <hr className="border-gray-200 my-2" />
                  <Link to="/auth/login" className="px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-100">
                    Iniciar sesión
                  </Link>
                  <Link to="/auth/signup" className="px-3 py-2 rounded-lg bg-primary-600 text-white">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 