import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/auth-context';
import logoImg from '../assets/AEISC_logo.png';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validaciones del cliente
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateUsername = (val: string) => {
    if (!val.trim()) {
      setUsernameError('El usuario o correo electrónico es obligatorio');
      return false;
    }
    // Si contiene '@', validar formato de correo
    if (val.includes('@')) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(val.trim())) {
        setUsernameError('El formato de correo no es válido');
        return false;
      }
    }
    setUsernameError(null);
    return true;
  };

  const validatePassword = (val: string) => {
    if (!val) {
      setPasswordError('La contraseña es obligatoria');
      return false;
    }
    if (val.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);

    if (!isUsernameValid || !isPasswordValid) return;

    setIsSubmitting(true);
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/', { replace: true });
      } else {
        setError('Usuario / Correo o contraseña incorrectos.');
      }
    } catch {
      setError('Ocurrió un error al intentar iniciar sesión. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e2e8f0]">
        
        {/* Logo e Identidad */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src={logoImg} 
            alt="AEISC Logo" 
            className="w-28 h-28 object-contain mb-4"
          />
          <h1 className="text-2xl font-bold text-[#0071ba] tracking-tight">
            Bingo AEISC 2026
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre de Usuario / Correo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Usuario / Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Mail size={20} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (usernameError) validateUsername(e.target.value);
                }}
                onBlur={() => validateUsername(username)}
                placeholder="usuario o usuario@ejemplo.com"
                className={`w-full rounded-2xl border bg-gray-50/50 py-3.5 pl-12 pr-4 text-gray-850 placeholder-gray-400 outline-none transition-all focus:border-[#00a0fe] focus:bg-white focus:ring-4 focus:ring-[#00a0fe]/10 ${
                  usernameError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200'
                }`}
              />
            </div>
            {usernameError && (
              <p className="mt-2 text-xs text-red-600">{usernameError}</p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Lock size={20} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                onBlur={() => validatePassword(password)}
                placeholder="••••••••"
                className={`w-full rounded-2xl border bg-gray-50/50 py-3.5 pl-12 pr-4 text-gray-850 placeholder-gray-400 outline-none transition-all focus:border-[#00a0fe] focus:bg-white focus:ring-4 focus:ring-[#00a0fe]/10 ${
                  passwordError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200'
                }`}
              />
            </div>
            {passwordError && (
              <p className="mt-2 text-xs text-red-600">{passwordError}</p>
            )}
          </div>

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-2xl bg-[#0071ba] py-4 text-base font-semibold text-white transition-all hover:bg-[#005f9e] active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              'Iniciar sesión'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
