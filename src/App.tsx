import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { CollectionProvider } from './contexts/CollectionContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home/Home'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Signup = lazy(() => import('./pages/Auth/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Search = lazy(() => import('./pages/Search/Search'));
const ProductDetail = lazy(() => import('./pages/Product/ProductDetail'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist'));
const Collection = lazy(() => import('./pages/Collection/Collection'));
const Premium = lazy(() => import('./pages/Premium/Premium'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CollectionProvider>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  
                  {/* Rutas protegidas (requieren autenticación) */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  } />
                  <Route path="/collection" element={
                    <ProtectedRoute>
                      <Collection />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/premium" element={<Premium />} />
                  
                  {/* Ruta 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </CollectionProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
