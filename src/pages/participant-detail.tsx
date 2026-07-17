import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  X,
  Loader2
} from 'lucide-react';
import { api } from '../services/api';

// Esquema del participante devuelto por la API en español
interface DjangoParticipant {
  id: string;
  nombre: string;
  telefono: string;
  carrera?: string;
  no_cuenta?: string;
  correo?: string;
  pagado: boolean;
  cartones: number;
  entregado: boolean;
  fecha_entrega?: string;
  entregado_por?: {
    username: string;
    name?: string;
  } | null;
  qr_code?: string;
  correo_enviado?: boolean;
}

export const ParticipantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetcher del participante por id
  const fetchParticipantDetail = async (pId: string) => {
    const response = await api.get<DjangoParticipant>(`/participantes/${pId}/`);
    return response.data;
  };

  // hook useQuery
  const { data: participant, isLoading, isError } = useQuery({
    queryKey: ['participant', id],
    queryFn: () => fetchParticipantDetail(id || ''),
    enabled: !!id,
  });

  // Mutación para alternar el estado de entrega (reversible por backend)
  const deliverMutation = useMutation({
    mutationFn: async (pId: string) => {
      const response = await api.post(`/participantes/${pId}/entregar/`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar caché del participante para recargar los datos actualizados
      queryClient.invalidateQueries({ queryKey: ['participant', id] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#0071ba]" />
      </div>
    );
  }

  if (isError || !participant) {
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

  const handleCopyLink = () => {
    // Si la URL del código QR es relativa, le anteponemos el servidor de la API
    const qrUrl = participant.qr_code?.startsWith('http')
      ? participant.qr_code
      : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '')}${participant.qr_code}`;

    navigator.clipboard.writeText(qrUrl || '').then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const handleToggleDelivery = () => {
    deliverMutation.mutate(participant.id);
  };

  // Formatear fecha
  const formatDeliveryDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('es-HN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateStr;
    }
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
            <h1 className="text-xl font-bold text-gray-855 leading-tight">
              {participant.nombre}
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
            <span className="text-sm font-semibold text-gray-700">{participant.telefono}</span>
          </div>
          
          <div>
            <span className="text-[10px] font-bold text-[#0071ba] tracking-wider uppercase block mb-0.5">
              Cartones Adquiridos
            </span>
            <span className="text-lg font-bold text-[#0071ba]">{participant.cartones}</span>
          </div>
        </div>
      </div>

      {/* Grid de Dos Columnas: Estado de Pago y Estado de Entrega */}
      <div className="grid grid-cols-2 gap-4">
        {/* Tarjeta Pago (Estática Siempre Pagado) */}
        <div className="rounded-3xl border border-gray-150 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-2.5">
            Estado de Pago
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-600">
            <CheckCircle2 size={12} className="stroke-[2.5]" />
            PAGADO
          </span>
        </div>

        {/* Tarjeta Entrega */}
        <div className="rounded-3xl border border-gray-150 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-2.5">
            Estado de Entrega
          </span>
          {participant.entregado ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-600">
              <CheckCircle2 size={12} className="stroke-[2.5]" />
              ENTREGADO
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-100 px-3 py-1 text-[11px] font-bold text-rose-600">
              <XCircle size={12} className="stroke-[2.5]" />
              NO ENTREGADO
            </span>
          )}
        </div>
      </div>

      {/* Subdetalles de la entrega si ya ocurrió */}
      {participant.entregado && (
        <div className="rounded-3xl border border-[#e2e8f0] bg-gray-50/50 px-6 py-4 text-center text-xs text-gray-450 leading-normal">
          Entregado por: <span className="font-semibold text-gray-650">{participant.entregado_por?.name || participant.entregado_por?.username || 'Staff'}</span>
          <span className="block mt-0.5 font-medium">{formatDeliveryDate(participant.fecha_entrega)}</span>
        </div>
      )}

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
              <span className="font-medium text-gray-700">{participant.correo || 'No especificado'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
                Cuenta
              </span>
              <span className="font-medium text-gray-700">{participant.no_cuenta || 'No especificado'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
                Carrera
              </span>
              <span className="font-medium text-gray-700">{participant.carrera || 'No especificado'}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
                Correo enviado
              </span>
              <span className="font-medium text-gray-700">{participant.correo_enviado ? 'Sí' : 'No'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Acciones del pie de página */}
      <div className="space-y-3 pt-4">
        {/* Lógica de Entrega Reversible (Llamando al endpoint de entrega) */}
        {participant.entregado ? (
          <button
            onClick={handleToggleDelivery}
            disabled={deliverMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-50 border border-rose-250 py-4 text-base font-semibold text-rose-600 transition-all hover:bg-rose-100 hover:text-rose-700 active:scale-[0.99] disabled:opacity-70"
          >
            {deliverMutation.isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <XCircle size={20} />
            )}
            Deshacer Entrega
          </button>
        ) : (
          <button
            onClick={handleToggleDelivery}
            disabled={deliverMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0071ba] py-4 text-base font-semibold text-white transition-all hover:bg-[#005f9e] active:scale-[0.99] shadow-[0_4px_12px_rgba(0,113,186,0.2)] disabled:opacity-70"
          >
            {deliverMutation.isPending ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <CheckCircle2 size={20} />
            )}
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
                Participante {participant.nombre}
              </p>
              <p className="text-[10px] text-gray-400 font-mono break-all">
                (ID: {participant.id})
              </p>
            </div>

            {/* Código QR Centrado */}
            <div className="flex flex-col items-center justify-center p-6 border border-gray-100 rounded-3xl bg-gray-50/50 mb-6">
              {/* Cargar imagen de QR real del backend o renderizar simulador si no existe */}
              {participant.qr_code ? (
                <img 
                  src={participant.qr_code.startsWith('http') ? participant.qr_code : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '')}${participant.qr_code}`} 
                  alt={`QR de ${participant.nombre}`}
                  className="h-48 w-48 object-contain bg-white p-2 rounded-2xl shadow-sm border border-gray-100"
                />
              ) : (
                <div className="h-48 w-48 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-4 shadow-sm">
                  <div className="grid grid-cols-6 grid-rows-6 gap-1 w-full h-full opacity-90">
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
                      QR AUTOMÁTICO
                    </div>
                  </div>
                </div>
              )}
              <p className="text-[10px] text-gray-400 text-center mt-3 max-w-[240px] leading-relaxed">
                Este código QR puede ser escaneado por el staff para confirmar la entrega y validar al participante.
              </p>
            </div>

            {/* Botones de acción del Modal */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    const qrUrl = participant.qr_code?.startsWith('http')
                      ? participant.qr_code
                      : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '')}${participant.qr_code}`;
                    
                    fetch(qrUrl || '')
                      .then(response => response.blob())
                      .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `QR_${participant.telefono}.png`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(url);
                      })
                      .catch(() => {
                        // Fallback si falla CORS (abre en pestaña nueva)
                        window.open(qrUrl || '', '_blank');
                      });
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-2xl bg-gray-50 border border-gray-200 py-3 text-xs font-bold text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-colors"
                >
                  <Download size={14} />
                  Descargar QR
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Código QR de Bingo',
                        text: `Código QR de ${participant.nombre}`,
                        url: participant.qr_code || window.location.href,
                      }).catch(console.error);
                    } else {
                      alert('La opción de compartir no es soportada en este navegador.');
                    }
                  }}
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
