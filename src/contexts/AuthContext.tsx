import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type UserInfo,
} from 'firebase/auth';
import { app } from '../firebase/config';

// Definimos un tipo User personalizado o usamos UserInfo de firebase
type User = UserInfo & {
  displayName: string | null;
  email: string | null;
  premium?: boolean;
};

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<User>;
  logIn: (email: string, password: string) => Promise<User>;
  logOut: () => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  updateProfile: (profileData: {displayName?: string}) => Promise<void>;
  updateEmail: (email: string, password: string) => Promise<void>;
  updatePassword: (newPassword: string, currentPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Asignamos el usuario con la propiedad premium para demo
      setCurrentUser(user ? {
        ...user,
        premium: false // Por defecto, los usuarios no son premium
      } as User : null);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user as User;
    } catch (error) {
      console.error('Error al registrarse:', error);
      throw error;
    }
  };

  const logIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user as User;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  const logOut = () => {
    return signOut(auth);
  };

  // Alias para logOut, para mantener compatibilidad con ambos nombres
  const logout = logOut;

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user as User;
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      throw error;
    }
  };

  // Métodos adicionales para gestionar el perfil
  const updateProfile = async (profileData: {displayName?: string}) => {
    if (!currentUser) throw new Error('No hay usuario autenticado');
    
    // En una implementación real, actualizaríamos el perfil de Firebase
    console.log('Actualización de perfil simulada:', profileData);
    
    // Simulamos la actualización para la demostración
    setCurrentUser({
      ...currentUser,
      displayName: profileData.displayName || currentUser.displayName
    });
    
    return Promise.resolve();
  };

  const updateEmail = async (email: string, password: string) => {
    if (!currentUser) throw new Error('No hay usuario autenticado');
    
    // En una implementación real, verificaríamos la credencial y cambiaríamos el email
    console.log('Actualización de email simulada:', email, 'Se requiere contraseña:', !!password);
    
    // Simulamos la actualización para la demostración
    setCurrentUser({
      ...currentUser,
      email: email
    });
    
    return Promise.resolve();
  };

  const updatePassword = async (newPassword: string, currentPassword: string) => {
    if (!currentUser) throw new Error('No hay usuario autenticado');
    
    // En una implementación real, verificaríamos la credencial y cambiaríamos la contraseña
    console.log('Actualización de contraseña simulada', 
                'Nueva contraseña:', !!newPassword, 
                'Contraseña actual:', !!currentPassword);
    
    return Promise.resolve();
  };

  const value = {
    currentUser,
    loading,
    signUp,
    logIn,
    logOut,
    logout,
    signInWithGoogle,
    updateProfile,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 