import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
// Importamos el nuevo componente
import { VerYDescargarTicket } from '../components/VerYDescargarTicket';

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
  correo_enviado?: boolean;
  qr_code?: string;
}

export const ParticipantsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const fetchParticipants = async (search: string) => {
    const response = await api.get<DjangoParticipant[]>('/participantes/', {
      params: search ? { search } : {},
    });
    return response.data;
  };

  const { data: participants, isLoading, isError } = useQuery({
    queryKey: ['participants', searchQuery],
    queryFn: () => fetchParticipants(searchQuery),
  });

  return (
    <div className="space-y-4 animate-fade-in">
      
      <div className="mb-2">
        <h2 className="text-xl font-bold text-gray-800">Lista de Participantes</h2>
      </div>

      <div className="sticky top-16 z-30 bg-[#f8fafc] py-2">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <Search size={20} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-850 placeholder-gray-450 outline-none transition-all focus:border-[#00a0fe] focus:ring-4 focus:ring-[#00a0fe]/10 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
          />
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-[#0071ba]" />
          </div>
        ) : isError ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-150 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
            <p className="text-sm font-semibold text-red-500">
              Ocurrió un error al cargar los participantes del servidor.
            </p>
          </div>
        ) : participants && participants.length > 0 ? (
          participants.map((p) => {
            // Suponiendo que las imágenes de los QR en Cloudinary se guardan con el formato 'public_id' del ID del participante.
            // Si tu backend de Django retorna directamente una URL de QR en un campo, cámbiala por: p.url_qr
            const urlQrConstruida = p.qr_code ?? '';

            return (
              <div
                key={p.id}
                onClick={() => navigate(`/participant/${encodeURIComponent(p.id)}`)}
                className="flex items-center justify-between rounded-3xl border border-gray-150 bg-white p-5 shadow-[0_6px_20px_rgba(0,0,0,0.015)] transition-all hover:bg-gray-50/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.02)] active:scale-[0.99] cursor-pointer"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-gray-855 text-[15px] leading-snug truncate">
                      {p.nombre}
                    </h3>
                    
                    <div className="flex items-center gap-2.5">
                      {p.entregado ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 border border-emerald-100/80 shrink-0">
                          <CheckCircle2 size={9} className="stroke-[2.5]" />
                          ENTREGADO
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold text-rose-600 border border-rose-100/80 shrink-0">
                          <XCircle size={9} className="stroke-[2.5]" />
                          NO ENTREGADO
                        </span>
                      )}
                      <span className="text-gray-300 text-xs">|</span>
                      <p className="text-[11px] text-gray-450 font-medium truncate">
                        {p.telefono} • {p.cartones} {p.cartones === 1 ? 'cartón' : 'cartones'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Acciones de la derecha: botón de Ticket y flecha */}
                <div className="flex items-center gap-3 shrink-0">
                  <VerYDescargarTicket 
                    participante={{ id: p.id, nombre: p.nombre, telefono: p.telefono, cartones: p.cartones }} 
                    urlQrCloudinary={urlQrConstruida} 
                  />
                  <div className="text-gray-350">
                    <ChevronRight size={18} />
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-gray-150 p-6 shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
            <p className="text-sm font-semibold text-gray-450">
              No se encontraron participantes para esta búsqueda.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};