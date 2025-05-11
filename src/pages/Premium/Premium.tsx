import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface PlanOption {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  recommended?: boolean;
}

const Premium = () => {
  const { currentUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans: PlanOption[] = [
    {
      id: 'monthly',
      name: 'Plan Mensual',
      price: 3.99,
      period: 'month',
      features: [
        'Acceso a historial de precios completo',
        'Alertas de precio para tu wishlist',
        'Sin publicidad',
        'Estadísticas avanzadas de colección'
      ]
    },
    {
      id: 'yearly',
      name: 'Plan Anual',
      price: 39.99,
      period: 'year',
      features: [
        'Acceso a historial de precios completo',
        'Alertas de precio para tu wishlist',
        'Sin publicidad',
        'Estadísticas avanzadas de colección',
        'Acceso a la API de precios',
        '2 meses gratis'
      ],
      recommended: true
    }
  ];

  const handleSubscribe = async () => {
    setIsProcessing(true);
    // Aquí iría la integración con el sistema de pagos
    try {
      // Simular proceso de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('¡Suscripción activada con éxito!');
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Ha ocurrido un error al procesar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Colexalia Premium</h1>
        <p className="text-xl text-gray-600">
          Desbloquea todas las funciones para gestionar tu colección de videojuegos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {plans.map(plan => (
          <div 
            key={plan.id}
            className={`card p-6 border-2 transition-all ${
              selectedPlan === plan.id 
                ? 'border-primary-500 ring-2 ring-primary-500 ring-opacity-50' 
                : 'border-gray-200 hover:border-primary-300'
            } ${plan.recommended ? 'relative' : ''}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-3 py-1 uppercase font-semibold tracking-wider transform translate-x-2 -translate-y-1/2">
                Recomendado
              </div>
            )}
            
            <div className="flex items-center mb-4">
              <div className={`w-5 h-5 rounded-full border ${
                selectedPlan === plan.id 
                  ? 'border-primary-500 bg-primary-500' 
                  : 'border-gray-300'
              } mr-3 flex items-center justify-center`}>
                {selectedPlan === plan.id && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold">{plan.price.toFixed(2)}€</span>
              <span className="text-gray-500">/{plan.period === 'month' ? 'mes' : 'año'}</span>
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg 
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">¿Por qué Premium?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Datos históricos completos</h3>
            <p className="text-gray-600">Accede al historial de precios completo para tomar mejores decisiones de compra.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Alertas de precio</h3>
            <p className="text-gray-600">Recibe notificaciones cuando los juegos de tu wishlist bajen de precio.</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Sin publicidad</h3>
            <p className="text-gray-600">Experiencia limpia y sin distracciones mientras usas la aplicación.</p>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        {currentUser ? (
          <button 
            className="btn btn-primary btn-lg"
            onClick={handleSubscribe}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              `Suscribirme al Plan ${selectedPlan === 'monthly' ? 'Mensual' : 'Anual'}`
            )}
          </button>
        ) : (
          <div className="card p-6">
            <p className="mb-4">Inicia sesión para suscribirte a Premium</p>
            <a href="/auth/login" className="btn btn-primary">Iniciar sesión</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Premium; 