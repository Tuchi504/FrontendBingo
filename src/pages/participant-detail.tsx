import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  QrCode,
  Download,
  Share2,
  Copy,
  Check,
  X
} from 'lucide-react';
import { getParticipants, updateParticipant } from '../services/mock-data';
import type { Participant } from '../services/mock-data';

export const ParticipantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [participant, setParticipant] = useState<Participant | null>(() => {
    if (id) {
      const list = getParticipants();
      return list.find(p => p.id === id || p.id === decodeURIComponent(id)) || null;
    }
    return null;
  });
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sincronizar el estado del participante si el ID en la URL cambia
  useEffect(() => {
    if (id) {
      const list = getParticipants();
      const found = list.find(p => p.id === id || p.id === decodeURIComponent(id));
      if (found) {
        /* eslint-disable-next-line react-hooks/set-state-in-effect */
        setParticipant(found);
      }
    }
  }, [id]);

  if (!participant) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold mb-4">Participante no encontrado</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#0071ba] px-6 py-3 text-white text-sm font-semibold"
        >
          <ArrowLeft size={16} />
          Volver al Inicio
        </button>
      </div>
    );
  }

  const handleConfirmDelivery = () => {
    const updated: Participant = {
      ...participant,
      isDelivered: true,
      deliveredBy: 'staff_user_1', // Simulamos el usuario actual del staff
      deliveredAt: new Date().toLocaleString('es-HN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
    updateParticipant(updated);
    setParticipant(updated);
  };

  const handleCopyLink = () => {
    const fakeLink = `${window.location.origin}/participant/${participant.id}`;
    navigator.clipboard.writeText(fakeLink).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12">
      {/* Vista Header con Botón de Atrás */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white border border-gray-150 text-gray-500 hover:bg-gray-50 transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Detalles del Participante</h2>
      </div>

      {/* Tarjeta 1: Información Personal Principal y Cartones */}
      <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
              Nombre del Participante
            </span>
            <h1 className="text-xl font-bold text-gray-850 leading-tight">
              {participant.name}
            </h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00a0fe]/10 text-[#00a0fe]">
            <User size={24} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-0.5">
              Teléfono
            </span>
            <span className="text-sm font-semibold text-gray-700">{participant.phone}</span>
          </div>
          
          <div>
            <span className="text-[10px] font-bold text-[#0071ba] tracking-wider uppercase block mb-0.5">
              Cartones Adquiridos
            </span>
            <span className="text-lg font-bold text-[#0071ba]">{participant.cardsCount}</span>
          </div>
        </div>
      </div>

      {/* Tarjeta 2: Estado de Entrega */}
      <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-3">
          Estado de Entrega
        </span>

        {participant.isDelivered ? (
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-600">
              <CheckCircle2 size={14} className="stroke-[2.5]" />
              ENTREGADO
            </span>
            <div className="text-[11px] text-gray-400 leading-normal">
              Entregado por: <span className="font-semibold text-gray-600">{participant.deliveredBy}</span>
              <span className="block mt-0.5">{participant.deliveredAt}</span>
            </div>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-100 px-4 py-1.5 text-xs font-bold text-rose-600">
            <XCircle size={14} className="stroke-[2.5]" />
            NO ENTREGADO
          </span>
        )}
      </div>


      {/* Acordeón: Información Adicional */}
      <div className="rounded-3xl border border-gray-150 bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <button
          onClick={() => setIsInfoExpanded(!isInfoExpanded)}
          className="flex w-full items-center justify-between px-6 py-5 font-semibold text-gray-700 outline-none hover:bg-gray-50/50 transition-colors"
        >
          <span>Información Adicional</span>
          {isInfoExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {isInfoExpanded && (
          <div className="px-6 pb-6 pt-1 border-t border-gray-50 space-y-4 text-sm animate-slide-down">
            <div>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
                Correo
              </span>
              <span className="font-medium text-gray-700">{participant.email}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
                Pagado
              </span>
              <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ${
                participant.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {participant.isPaid ? 'Sí' : 'No'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
                Correo enviado
              </span>
              <span className="font-medium text-gray-700">{participant.emailSent ? 'Sí' : 'No'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Acciones del pie de página */}
      <div className="space-y-3 pt-4">
        {participant.isDelivered ? (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-100 border border-gray-200 py-4 text-base font-semibold text-gray-400 cursor-not-allowed"
          >
            <CheckCircle2 size={20} />
            Entrega Completada
          </button>
        ) : (
          <button
            onClick={handleConfirmDelivery}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0071ba] py-4 text-base font-semibold text-white transition-all hover:bg-[#005f9e] active:scale-[0.99] shadow-[0_4px_12px_rgba(0,113,186,0.2)]"
          >
            <CheckCircle2 size={20} />
            Confirmar Entrega
          </button>
        )}

        <button
          onClick={() => setIsQrModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-50 border border-gray-200 py-4 text-base font-semibold text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-800 active:scale-[0.99]"
        >
          <QrCode size={18} />
          Ver Código QR
        </button>
      </div>

      {/* Modal de Compartir Código QR (Mockup 7) */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-[32px] bg-white p-6 shadow-2xl border border-gray-100 animate-scale-up">
            
            {/* Header del Modal */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Código QR del participante</h3>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full text-gray-450 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Detalles del participante */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-[#0071ba] mb-1">
                Participante {participant.name}
              </p>
              <p className="text-[10px] text-gray-400 font-mono break-all">
                (ID: {participant.id})
              </p>
            </div>

            {/* Código QR Centrado */}
            <div className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-3xl bg-gray-50/50 mb-6">
              {/* Representación visual de un QR para emulación completa */}
              <div className="h-48 w-48 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-4 shadow-sm">
                <div className="grid grid-cols-6 grid-rows-6 gap-1 w-full h-full opacity-90">
                  {/* Esquinas y patrones simulando estructura real de QR */}
                  <div className="col-span-2 row-span-2 bg-gray-800 rounded-xs" />
                  <div className="col-span-2" />
                  <div className="col-span-2 row-span-2 bg-gray-800 rounded-xs" />
                  
                  <div className="col-span-2" />
                  <div className="bg-gray-800" />
                  <div className="bg-gray-800" />
                  
                  <div className="col-span-2 row-span-2 bg-gray-800 rounded-xs" />
                  <div className="bg-gray-800" />
                  <div className="bg-gray-800 animate-pulse" />
                  <div className="col-span-2" />
                  
                  <div className="bg-gray-800" />
                  <div className="bg-gray-850" />
                  <div className="bg-gray-800" />
                  <div className="bg-gray-800" />
                  
                  <div className="col-span-6 flex items-center justify-center text-[10px] font-bold text-gray-400 tracking-widest pt-2">
                    QR SIMULADO
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-3 max-w-[240px] leading-relaxed">
                Este código QR contiene el ID del participante y puede ser escaneado para acceder rápidamente a sus datos.
              </p>
            </div>

            {/* Botones de acción del Modal */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => alert('Descarga de QR simulada.')}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-gray-50 border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <Download size={14} />
                  Descargar QR
                </button>
                <button
                  onClick={() => alert('Compartido simulado.')}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-gray-50 border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <Share2 size={14} />
                  Compartir
                </button>
              </div>

              <button
                onClick={handleCopyLink}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-gray-50 border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check size={14} className="text-emerald-600" />
                    <span className="text-emerald-600">¡Enlace copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    Copiar enlace
                  </>
                )}
              </button>

              <button
                onClick={() => setIsQrModalOpen(false)}
                className="flex w-full items-center justify-center rounded-2xl bg-[#00a0fe] py-3.5 text-sm font-bold text-white hover:bg-[#008de0] transition-colors mt-2"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
