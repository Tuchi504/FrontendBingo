import React from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Info } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Control Card Container */}
      <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        
        {/* Title and Subtitle */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-850">
            Escáner de Control
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Gestión de entrega de cartones
          </p>
        </div>

        {/* Giant Scanning Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => navigate('/scan')}
            className="flex h-56 w-56 flex-col items-center justify-center rounded-[32px] bg-[#00a0fe] text-white shadow-[0_12px_24px_rgba(0,160,254,0.3)] transition-all duration-300 hover:bg-[#008de0] hover:shadow-[0_16px_32px_rgba(0,160,254,0.4)] active:scale-[0.98] outline-none"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 mb-4">
              <QrCode size={40} className="stroke-[2]" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Escanear Código QR
            </span>
            <span className="text-xs text-white/80 mt-1 font-medium">
              del Participante
            </span>
          </button>
        </div>

        {/* Information Box */}
        <div className="flex gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-4 text-gray-500">
          <Info className="h-5 w-5 shrink-0 text-[#00a0fe]" />
          <div className="text-xs leading-relaxed">
            <span className="font-semibold block text-gray-700 mb-0.5">Instrucciones</span>
            Escanea el código QR para gestionar la entrega de cartones. Asegúrate de tener buena iluminación.
          </div>
        </div>

      </div>
    </div>
  );
};
