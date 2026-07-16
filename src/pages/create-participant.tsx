import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, Minus, Plus, CreditCard, Gift, Loader2 } from 'lucide-react';
import { addParticipant } from '../services/mock-data';
import type { Participant } from '../services/mock-data';

export const CreateParticipant: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [cardsCount, setCardsCount] = useState(1);
  const [isPaid, setIsPaid] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (cardsCount > 1) {
      setCardsCount(cardsCount - 1);
    }
  };

  const handleIncrement = () => {
    setCardsCount(cardsCount + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isNameValid = validateName(name);
    const isPhoneValid = validatePhone(phone);
    const isEmailValid = validateEmail(email);

    if (!isNameValid || !isPhoneValid || !isEmailValid) return;

    setIsSubmitting(true);

    // Simular pequeño retraso
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newId = `participant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newParticipant: Participant = {
      id: newId,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@ejemplo.com`,
      cardsCount,
      isPaid,
      isDelivered,
      deliveredBy: isDelivered ? 'staff_user_1' : null,
      deliveredAt: isDelivered 
        ? new Date().toLocaleString('es-HN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })
        : null,
      emailSent: false,
    };

    addParticipant(newParticipant);
    setIsSubmitting(false);

    // Redirigir directamente al detalle del participante recién creado para que puedan ver su QR
    navigate(`/participant/${encodeURIComponent(newId)}`);
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
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) validateName(e.target.value);
                }}
                onBlur={() => validateName(name)}
                placeholder="Ej. Juan Pérez"
                className={`w-full rounded-2xl border bg-gray-50/50 py-3.5 pl-12 pr-4 text-sm text-gray-850 placeholder-gray-400 outline-none transition-all focus:border-[#00a0fe] focus:bg-white focus:ring-4 focus:ring-[#00a0fe]/10 ${
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
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (phoneError) validatePhone(e.target.value);
                }}
                onBlur={() => validatePhone(phone)}
                placeholder="Ej. 555-0123"
                className={`w-full rounded-2xl border bg-gray-50/50 py-3.5 pl-12 pr-4 text-sm text-gray-850 placeholder-gray-400 outline-none transition-all focus:border-[#00a0fe] focus:bg-white focus:ring-4 focus:ring-[#00a0fe]/10 ${
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
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                placeholder="Ej. jperez@unah.edu.hn"
                className={`w-full rounded-2xl border bg-gray-50/50 py-3.5 pl-12 pr-4 text-sm text-gray-850 placeholder-gray-400 outline-none transition-all focus:border-[#00a0fe] focus:bg-white focus:ring-4 focus:ring-[#00a0fe]/10 ${
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
                {cardsCount}
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

        {/* Bloque de Estado de Pago (Toggle) */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#00a0fe]/10 text-[#00a0fe]">
              <CreditCard size={18} />
            </div>
            <div>
              <span className="block text-sm font-bold text-gray-800">Pagado</span>
              <span className="block text-xs text-gray-400">El participante ha cancelado el monto</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsPaid(!isPaid)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
              isPaid ? 'bg-emerald-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isPaid ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
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
            onClick={() => setIsDelivered(!isDelivered)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
              isDelivered ? 'bg-teal-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                isDelivered ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0071ba] py-4 text-base font-semibold text-white transition-all hover:bg-[#005f9e] active:scale-[0.99] disabled:opacity-50 shadow-[0_4px_12px_rgba(0,113,186,0.2)]"
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            'Crear Participante'
          )}
        </button>

      </form>
    </div>
  );
};
