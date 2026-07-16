import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/auth-context';
import { PrivateRoute } from './components/private-route';
import { Login } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { Scan } from './pages/scan';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta Pública */}
          <Route path="/login" element={<Login />} />

          {/* Rutas Privadas */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scan" element={<Scan />} />
            {/* Las demás rutas se irán enlazando conforme se creen sus pantallas correspondientes */}
          </Route>

          {/* Fallback de redirección */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
