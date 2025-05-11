import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="text-9xl font-bold text-primary-600 mb-4">404</div>
      
      <h1 className="text-3xl font-bold mb-4">Página no encontrada</h1>
      
      <p className="text-gray-600 text-center max-w-md mb-8">
        Lo sentimos, pero la página que estás buscando no existe o ha sido movida.
      </p>
      
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
        
        <Link to="/search" className="btn btn-secondary">
          Buscar juegos
        </Link>
      </div>
      
      <div className="mt-16">
        <img 
          src="/not-found-illustration.png" 
          alt="Página no encontrada" 
          className="max-w-xs"
          onError={(e) => {
            // Si la imagen personalizada no existe, ocultarla
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
};

export default NotFound; 