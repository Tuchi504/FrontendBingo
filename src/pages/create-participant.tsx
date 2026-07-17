import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, User, Phone, Mail, Minus, Plus, Gift, Loader2 } from 'lucide-react';
import { api } from '../services/api';

// Interfaz para la respuesta de creación de participante de Django
interface CreateResponse {
  id: string;
  nombre: string;
  telefono: string;
  cartones: number;
  correo?: string;
  pagado: boolean;
  entregado: boolean;
}

export const CreateParticipant: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [cartones, setCartones] = useState(1);
  const [entregado, setEntregado] = useState(false);

  // Estados de error de validación
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateName = (val: string) => {
    if (!val.trim()) {
      setNameError('El nombre completo es obligatorio');
      return false;
    }
    setNameError(null);
    return true;
  };

  const validatePhone = (val: string) => {
    if (!val.trim()) {
      setPhoneError('El número de teléfono es obligatorio');
      return false;
    }
    const regex = /^\d{8,15}$/; // Acepta teléfonos de 8 a 15 dígitos
    if (!regex.test(val.trim())) {
      setPhoneError('El teléfono debe contener entre 8 y 15 dígitos numéricos');
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const validateEmail = (val: string) => {
    if (val.trim()) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(val.trim())) {
        setEmailError('El formato de correo no es válido');
        return false;
      }
    }
    setEmailError(null);
    return true;
  };

  const handleDecrement = () => {
    if (cartones > 1) {
      setCartones(cartones - 1);
    }
  };

  const handleIncrement = () => {
    setCartones(cartones + 1);
  };

  // Mutación para realizar POST /api/participantes/
  const createMutation = useMutation({
    mutationFn: async (payload: {
      nombre: string;
      telefono: string;
      correo: string;
      cartones: number;
      pagado: boolean;
      entregado: boolean;
    }) => {
      const response = await api.post<CreateResponse>('/participantes/', payload);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidar caché del listado general para que cargue el nuevo registro
      queryClient.invalidateQueries({ queryKey: ['participants'] });
      // Redirigir directamente al detalle del participante creado
      navigate(`/participant/${encodeURIComponent(data.id)}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isNameValid = validateName(nombre);
    const isPhoneValid = validatePhone(telefono);
    const isEmailValid = validateEmail(correo);

    if (!isNameValid || !isPhoneValid || !isEmailValid) return;

    createMutation.mutate({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      correo: correo.trim() || `${nombre.trim().toLowerCase().replace(/\s+/g, '.')}@ejemplo.com`,
      cartones,
      pagado: true, // El estado de pago siempre se guarda como True por defecto
      entregado,
    });
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      
      {/* Header con botón de atrás */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-gray-150 text-gray-500 hover:bg-gray-50 transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Crear Participante</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Bloque de Información Personal */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-5">
          {/* Nombre Completo */}
          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
              Nombre Completo *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (nameError) validateName(e.target.value);
                }}
                onBlur={() => validateName(nombre)}
                placeholder="Ej. Juan Pérez"
                className={`w-full rounded-2xl border bg-gray-50/50 py-3.5 pl-12 pr-4 text-sm text-gray-855 placeholder-gray-400 outline-none transition-all focus:border-[#00a0fe] focus:bg-white focus:ring-4 focus:ring-[#00a0fe]/10 ${
                  nameError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200'
                }`}
              />
            </div>
            {nameError && (
              <p className="mt-2 text-xs text-red-650">{nameError}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
              Número de Teléfono *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Phone size={18} />
              </span>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => {
                  setTelefono(e.target.value);
                  if (phoneError) validatePhone(e.target.value);
                }}
                onBlur={() => validatePhone(telefono)}
                placeholder="Ej. 555-0123"
                className={`w-full rounded-2xl border bg-gray-50/50 py-3.5 pl-12 pr-4 text-sm text-gray-855 placeholder-gray-400 outline-none transition-all focus:border-[#00a0fe] focus:bg-white focus:ring-4 focus:ring-[#00a0fe]/10 ${
                  phoneError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200'
                }`}
              />
            </div>
            {phoneError && (
              <p className="mt-2 text-xs text-red-650">{phoneError}</p>
            )}
          </div>

          {/* Correo Electrónico (Opcional) */}
          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2">
              Correo Electrónico (Opcional)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(correo)}
                placeholder="Ej. jperez@unah.edu.hn"
                className={`w-full rounded-2xl border bg-gray-50/50 py-3.5 pl-12 pr-4 text-sm text-gray-855 placeholder-gray-400 outline-none transition-all focus:border-[#00a0fe] focus:bg-white focus:ring-4 focus:ring-[#00a0fe]/10 ${
                  emailError ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-gray-200'
                }`}
              />
            </div>
            {emailError && (
              <p className="mt-2 text-xs text-red-650">{emailError}</p>
            )}
          </div>
        </div>

        {/* Bloque de Número de Cartones */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-4">
          <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase">
            Número de Cartones *
          </label>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Cantidad solicitada</span>
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-150 rounded-2xl p-1.5">
              <button
                type="button"
                onClick={handleDecrement}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors active:scale-95"
              >
                <Minus size={16} />
              </button>
              <span className="w-12 text-center text-base font-bold text-gray-800">
                {cartones}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors active:scale-95"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bloque de Estado de Entrega (Toggle) */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <Gift size={18} />
            </div>
            <div>
              <span className="block text-sm font-bold text-gray-800">Entregado</span>
              <span className="block text-xs text-gray-400">Cartones entregados al participante</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEntregado(!entregado)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
              entregado ? 'bg-teal-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                entregado ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0071ba] py-4 text-base font-semibold text-white transition-all hover:bg-[#005f9e] active:scale-[0.99] disabled:opacity-50 shadow-[0_4px_12px_rgba(0,113,186,0.2)]"
        >
          {createMutation.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            'Crear Participante'
          )}
        </button>

      </form>
    </div>
  );
};
