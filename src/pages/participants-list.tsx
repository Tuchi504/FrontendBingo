import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { getParticipants } from '../services/mock-data';
import type { Participant } from '../services/mock-data';

export const ParticipantsList: React.FC = () => {
  const navigate = useNavigate();
  const [participants] = useState<Participant[]>(() => getParticipants());
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrado reactivo por nombre o teléfono
  const filteredParticipants = participants.filter((p) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.phone.includes(query)
    );
  });

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* Título de la sección */}
      <div className="mb-2">
        <h2 className="text-xl font-bold text-gray-800">Lista de Participantes</h2>
      </div>

      {/* Header Buscador (Mockup 3) */}
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

      {/* Listado Vertical - padding superior para evitar superposición */}
      <div className="space-y-3 pt-2">
        {filteredParticipants.length > 0 ? (
          filteredParticipants.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/participant/${encodeURIComponent(p.id)}`)}
              className="flex items-center justify-between rounded-3xl border border-gray-150 bg-white p-5 shadow-[0_6px_20px_rgba(0,0,0,0.015)] transition-all hover:bg-gray-50/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.02)] active:scale-[0.99] cursor-pointer"
            >
              {/* Información Principal del Participante */}
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-gray-855 text-[15px] leading-snug truncate">
                    {p.name}
                  </h3>
                  
                  {/* Badge de Estado y Subdetalles en la misma fila para consistencia */}
                  <div className="flex items-center gap-2.5">
                    {p.isDelivered ? (
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
                      {p.phone} • {p.cardsCount} {p.cardsCount === 1 ? 'cartón' : 'cartones'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Icono de Navegación */}
              <div className="text-gray-350 shrink-0">
                <ChevronRight size={18} />
              </div>

            </div>
          ))
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
