import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <Link to="/" className="flex items-center mb-4">
              <img 
                src="/logo.svg" 
                alt="EuroGameTracker" 
                className="h-8 w-8 mr-2"
                onError={(e) => {
                  // Fallback si el logo no está disponible
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-xl font-bold">EuroGameTracker</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Seguimiento de precios de videojuegos europeos.
              Crea tu colección y mantente al día de los precios de mercado.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                Twitter
              </a>
              <a 
                href="https://discord.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                Discord
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white">
                  Explorar
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-white">
                  Mi Wishlist
                </Link>
              </li>
              <li>
                <Link to="/collection" className="text-gray-400 hover:text-white">
                  Mi Colección
                </Link>
              </li>
              <li>
                <Link to="/premium" className="text-gray-400 hover:text-white">
                  Premium
                </Link>
              </li>
            </ul>
          </div>

          {/* Información legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Información legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-white">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>
            © {currentYear} EuroGameTracker. Todos los derechos reservados.
          </p>
          <p className="mt-2">
            EuroGameTracker no está afiliado oficialmente con ningún fabricante de consolas.
            Todos los precios son obtenidos a través de la API de PriceCharting.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 