import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera, AlertCircle } from 'lucide-react';

export const Scan: React.FC = () => {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const SCANNER_ELEMENT_ID = 'qr-reader-viewport';

  useEffect(() => {
    // Inicializar el escáner al montar el componente
    const html5Qrcode = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = html5Qrcode;

    const startScanner = async () => {
      try {
        setIsInitializing(true);
        setCameraError(null);

        // Iniciar cámara con prioridad trasera (environment)
        await html5Qrcode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: (width, height) => {
              // Caja de enfoque responsiva proporcional al viewport
              const size = Math.min(width, height) * 0.7;
              return { width: size, height: size };
            },
          },
          (decodedText) => {
            // Callback en caso de éxito de lectura
            if (navigator.vibrate) {
              navigator.vibrate(100);
            }
            
            // Detener el scanner antes de redirigir
            html5Qrcode.stop().then(() => {
              navigate(`/participant/${encodeURIComponent(decodedText)}`);
            }).catch(() => {
              // Si falla stop, redirigir de igual forma
              navigate(`/participant/${encodeURIComponent(decodedText)}`);
            });
          },
          () => {
            // Callback silencioso para fallos de frames individuales (se ignora para no saturar)
          }
        );
        setIsInitializing(false);
      } catch {
        setIsInitializing(false);
        setCameraError(
          'No se pudo acceder a la cámara trasera. Asegúrate de conceder permisos e intentar desde un dispositivo móvil.'
        );
      }
    };

    // Pequeño retardo para asegurar que el div contenedor ya esté renderizado en el DOM
    const timer = setTimeout(() => {
      startScanner();
    }, 150);

    return () => {
      clearTimeout(timer);
      // Limpieza exhaustiva de los recursos de cámara al desmontar
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch((e) => console.error('Error al detener la cámara en cleanup:', e));
      }
    };
  }, [navigate]);

  const handleClose = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        console.error('Error al detener cámara en botón cerrar:', e);
      }
    }
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
      
      {/* Elemento de lectura invisible/detrás de la UI para capturar el feed */}
      <div id={SCANNER_ELEMENT_ID} className="absolute inset-0 h-full w-full object-cover" />

      {/* Capa decorativa / Overlay que simula el mockup */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-10 bg-black/40">
        
        {/* Header Superior del visor */}
        <div className="p-6 text-center bg-gradient-to-b from-black/80 to-transparent">
          <h2 className="text-xl font-bold tracking-tight">Escáner</h2>
          <p className="text-xs text-white/70 mt-1 max-w-xs mx-auto">
            Enfoque el código QR dentro del recuadro del participante para ver sus detalles.
          </p>
        </div>

        {/* Recuadro de Enfoque Visual al centro */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-64 h-64 border-2 border-white/40 rounded-3xl flex items-center justify-center">
            {/* Esquinas del mockup */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#00a0fe] rounded-tl-2xl" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#00a0fe] rounded-tr-2xl" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#00a0fe] rounded-bl-2xl" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#00a0fe] rounded-br-2xl" />

            {/* Sub-recuadro indicador de foco */}
            <div className="w-48 h-48 border border-[#00a0fe]/30 rounded-2xl animate-pulse flex items-center justify-center" />
          </div>
        </div>

        {/* Controles del área inferior */}
        <div className="p-8 flex flex-col items-center gap-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
          {isInitializing && (
            <div className="flex items-center gap-2 text-xs text-white/80 bg-white/10 px-4 py-2 rounded-full">
              <Camera size={14} className="animate-pulse" />
              Iniciando cámara trasera...
            </div>
          )}

          {cameraError && (
            <div className="flex gap-2.5 items-start text-xs text-red-200 bg-red-950/80 border border-red-900/50 p-4 rounded-2xl max-w-xs">
              <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
              <span>{cameraError}</span>
            </div>
          )}

          <button
            onClick={handleClose}
            className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white border border-white/20 transition-all hover:bg-white/25 active:scale-95 shadow-lg"
          >
            <X size={16} />
            Cerrar Escáner
          </button>
        </div>

      </div>

    </div>
  );
};
