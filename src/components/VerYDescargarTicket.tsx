import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Ticket, X, Download } from 'lucide-react';

interface Participant {
  id: string;
  nombre: string;
  telefono: string;
  cartones: number;
}

interface VerYDescargarTicketProps {
  participante: Participant;
  urlQrCloudinary: string; // La URL de Cloudinary del QR ya generado
}

const URL_PLANTILLA_FONDO = "https://res.cloudinary.com/pwipm80z/image/upload/v1784306535/Frame_1_2_rvy3no.jpg";

export const VerYDescargarTicket: React.FC<VerYDescargarTicketProps> = ({ participante, urlQrCloudinary }) => {
  const [ticketPreviewUrl, setTicketPreviewUrl] = useState<string | null>(null);
  const [generando, setGenerando] = useState(false);
  const [enviado, setEnviado] = useState(false); // 👈 nuevo: para pintar el ícono al enviar

  const generarCanvasCompleto = async (): Promise<HTMLCanvasElement | null> => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const imgFondo = new Image();
      imgFondo.crossOrigin = "anonymous";
      imgFondo.src = URL_PLANTILLA_FONDO;

      await new Promise((resolve, reject) => {
        imgFondo.onload = resolve;
        imgFondo.onerror = () => reject(new Error("No se pudo cargar la plantilla del ticket."));
      });

      // Canvas = tamaño REAL de tu plantilla (3600x1800), sin distorsión
      canvas.width = imgFondo.naturalWidth;
      canvas.height = imgFondo.naturalHeight;
      ctx.drawImage(imgFondo, 0, 0, canvas.width, canvas.height);

      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      // --- NOMBRE (al lado de "Nombre:") ---
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 70px sans-serif";
      ctx.fillText(participante.nombre.toUpperCase(), 420, 630);

      // --- NÚMERO (al lado de "Número:") ---
      ctx.font = "600 65px sans-serif";
      ctx.fillText(participante.telefono, 420, 728);

      // --- CANTIDAD DE BOLETOS (al lado de "Cantidad de boletos:") ---
      ctx.font = "bold 80px sans-serif";
      ctx.fillStyle = "#0071ba";
      ctx.fillText(`${participante.cartones}`, 1000, 1383);

      // --- CÓDIGO QR (centrado en el espacio entre "Número:" y "Cantidad de boletos:") ---
      const imgQr = new Image();
      imgQr.crossOrigin = "anonymous";
      imgQr.src = urlQrCloudinary;

      await new Promise((resolve, reject) => {
        imgQr.onload = resolve;
        imgQr.onerror = () => reject(new Error("No se pudo cargar el código QR del participante."));
      });

      ctx.drawImage(imgQr, 420, 880, 350, 350);

      return canvas;
    } catch (error) {
      console.error("Error al generar el ticket:", error);
      alert("Error al estructurar el diseño del ticket.");
      return null;
    }
  };

  const verVistaPrevia = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que el click abra los detalles del participante
    setGenerando(true);
    const canvas = await generarCanvasCompleto();
    setGenerando(false);

    if (canvas) {
      const previewUrl = canvas.toDataURL('image/png');
      setTicketPreviewUrl(previewUrl);
    }
  };

  const cerrarModal = (e: React.MouseEvent) => {
    e.stopPropagation(); // 👈 CLAVE: esto es lo que faltaba
    setTicketPreviewUrl(null);
  };

  const descargarYCompartir = (e: React.MouseEvent) => {
    e.stopPropagation(); // 👈 también aquí, por si acaso
    if (!ticketPreviewUrl) return;

    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = ticketPreviewUrl;
    const nombreArchivo = `ticket_${participante.nombre.toLowerCase().replace(/\s+/g, '_')}.png`;
    enlaceDescarga.download = nombreArchivo;

    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();
    document.body.removeChild(enlaceDescarga);

    const mensajeTexto = `🎉 ¡EL GRAN DÍA SE ACERCA! 🤩

¿Listos para cantar ¡BINGO! y llevarse premios increíbles? 🎁✨ Aquí te dejamos toda la información clave para que no te pierdas de nada este sábado 18 de julio:

📍 ¿Dónde? Plaza Registro, UNAH
🕐 ¿A qué hora? De 1:00 PM a 5:00 PM

⚠️ INDICACIÓN SUPER IMPORTANTE:
Para poder ingresar y asignarte tus cartones, lleva a mano tu comprobante/ticket digital (como el de esta imagen) en tu celular. Estaremos escaneando el código QR en la entrada para verificar tu identidad y la cantidad de boletos adquiridos de forma rápida. 📲⚡️

¡Evitemos filas y disfrutemos al máximo desde el primer minuto! Te esperamos con la mejor energía. 💙💛`;

    // 👇 Ajusta el código de país si tus participantes no son de Honduras
    const numeroLimpio = participante.telefono.replace(/\D/g, '');
    const numeroConCodigo = numeroLimpio.startsWith('504') ? numeroLimpio : `504${numeroLimpio}`;
    const urlWhatsapp = `https://wa.me/${numeroConCodigo}?text=${encodeURIComponent(mensajeTexto)}`;

    window.open(urlWhatsapp, '_blank');
    setTicketPreviewUrl(null);
    setEnviado(true); // 👈 marca como enviado para pintar el ícono
  };

  return (
    <>
      <button
        onClick={verVistaPrevia}
        disabled={generando}
        className="flex items-center justify-center p-2 rounded-2xl bg-gray-100 text-gray-700 hover:bg-[#00a0fe]/10 hover:text-[#00a0fe] transition-all active:scale-95 disabled:opacity-50"
        title={enviado ? "Ticket enviado" : "Ver Ticket"}
      >
        <Ticket
          size={18}
          className={
            generando
              ? "animate-pulse text-[#00a0fe]"
              : enviado
                ? "text-emerald-500" // 👈 verde una vez que se envió por WhatsApp
                : ""
          }
        />
      </button>

      {ticketPreviewUrl && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          onClick={(e) => {
            e.stopPropagation(); // 👈 corta la propagación del backdrop también
            if (e.target === e.currentTarget) setTicketPreviewUrl(null);
          }}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative flex flex-col items-center gap-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()} // 👈 por si el click cae dentro de la tarjeta
          >
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold text-gray-800 mt-2">Pase de Entrada</h3>

            <div className="border border-gray-100 shadow-sm rounded-2xl overflow-hidden max-h-[50vh] flex items-center justify-center bg-gray-50">
              <img src={ticketPreviewUrl} alt="Ticket final" className="max-h-full max-w-full object-contain" />
            </div>

            <div className="w-full">
              <button
                onClick={descargarYCompartir}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Descargar y Enviar por WhatsApp
              </button>
            </div>
          </div>
        </div>,
        document.body // 👈 se monta directo aquí, escapando de cualquier ancestro con transform
      )}
    </>
  );
};