import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Settings = () => {
  const { currentUser, updateProfile, updateEmail, updatePassword, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Estados para los formularios
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  
  // Configuraciones de notificaciones
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    priceAlerts: true,
    weeklyReports: false,
    marketingEmails: false
  });

  // Configuraciones de privacidad
  const [privacy, setPrivacy] = useState({
    showCollection: true,
    showWishlist: true,
    publicProfile: false
  });

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      
      // Simular carga de configuraciones de usuario desde la base de datos
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Actualizar nombre de usuario
      if (displayName !== currentUser?.displayName) {
        await updateProfile({ displayName });
      }
      
      // Actualizar email
      if (email !== currentUser?.email && currentPassword) {
        await updateEmail(email, currentPassword);
      }
      
      // Actualizar contraseña
      if (newPassword && newPassword === confirmPassword && currentPassword) {
        await updatePassword(newPassword, currentPassword);
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
      }
      
      setMessage({ 
        text: 'Configuración actualizada correctamente', 
        type: 'success' 
      });
    } catch (error) {
      setMessage({ 
        text: 'Error al actualizar la configuración. Verifica tu contraseña actual.', 
        type: 'error' 
      });
      console.error('Error al actualizar perfil:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPrivacy(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleLogout = async () => {
    try {
      await logout();
      // La redirección la manejará el contexto de autenticación
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setMessage({ text: 'Error al cerrar sesión', type: 'error' });
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      // Aquí iría la lógica para eliminar la cuenta
      alert('Función no implementada en la versión demo');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Acceso denegado</h2>
        <p className="mb-6">Debes iniciar sesión para acceder a esta página</p>
        <a href="/auth/login" className="btn btn-primary">Iniciar sesión</a>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Configuración</h1>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Perfil */}
          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Tu Perfil</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="input w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Para cambiar tu email, deberás introducir tu contraseña actual.
                  </p>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    className="input w-full"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Dejar en blanco para mantener la actual"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Confirmar nueva contraseña
                  </label>
                  <input
                    type="password"
                    className="input w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Contraseña actual
                  </label>
                  <input
                    type="password"
                    className="input w-full"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Requerido para cambios de email o contraseña"
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Notificaciones */}
          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Notificaciones</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={notifications.emailNotifications}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-3 block text-gray-700">
                    Recibir notificaciones por email
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="priceAlerts"
                    name="priceAlerts"
                    checked={notifications.priceAlerts}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="priceAlerts" className="ml-3 block text-gray-700">
                    Alertas de precios para tu wishlist
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="weeklyReports"
                    name="weeklyReports"
                    checked={notifications.weeklyReports}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="weeklyReports" className="ml-3 block text-gray-700">
                    Informes semanales de tu colección
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketingEmails"
                    name="marketingEmails"
                    checked={notifications.marketingEmails}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="marketingEmails" className="ml-3 block text-gray-700">
                    Recibir noticias y promociones
                  </label>
                </div>
              </div>
              
              <button
                className="btn btn-primary mt-6"
                onClick={() => setMessage({ text: 'Preferencias de notificaciones guardadas', type: 'success' })}
              >
                Guardar preferencias
              </button>
            </div>
          </div>
          
          {/* Privacidad */}
          <div className="card">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Privacidad</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showCollection"
                    name="showCollection"
                    checked={privacy.showCollection}
                    onChange={handlePrivacyChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showCollection" className="ml-3 block text-gray-700">
                    Hacer mi colección visible públicamente
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showWishlist"
                    name="showWishlist"
                    checked={privacy.showWishlist}
                    onChange={handlePrivacyChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showWishlist" className="ml-3 block text-gray-700">
                    Hacer mi wishlist visible públicamente
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="publicProfile"
                    name="publicProfile"
                    checked={privacy.publicProfile}
                    onChange={handlePrivacyChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="publicProfile" className="ml-3 block text-gray-700">
                    Mostrar mi perfil en búsquedas públicas
                  </label>
                </div>
              </div>
              
              <button
                className="btn btn-primary mt-6"
                onClick={() => setMessage({ text: 'Configuración de privacidad guardada', type: 'success' })}
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        </div>
        
        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Membresía */}
          <div className="card p-6">
            <h3 className="font-semibold mb-2">Tu membresía</h3>
            <p className="text-sm text-gray-600 mb-4">
              {currentUser.premium 
                ? 'Tienes una suscripción Premium activa.' 
                : 'Actualmente estás usando la versión gratuita.'}
            </p>
            <a href="/premium" className="btn btn-primary block text-center">
              {currentUser.premium ? 'Gestionar suscripción' : 'Mejorar a Premium'}
            </a>
          </div>
          
          {/* Sesión */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Sesión</h3>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary w-full mb-4"
            >
              Cerrar sesión
            </button>
            <button 
              onClick={handleDeleteAccount}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Eliminar mi cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 