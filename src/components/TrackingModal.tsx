import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Truck, MapPin, CheckCircle2, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTrackingData } from "@/lib/tracking";
import type { TrackingData } from "@/lib/tracking";
import { useEffect, useState } from "react";
import { fetchTrackingByCode } from "@/lib/cloud";

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingCode: string;
  trackingData?: TrackingData;
}

const TrackingModal = ({ isOpen, onClose, trackingCode, trackingData: override }: TrackingModalProps) => {
  const [resolved, setResolved] = useState<TrackingData | null>(override ?? getTrackingData(trackingCode));
  
  useEffect(() => {
    let alive = true;
    if (!override && trackingCode) {
      fetchTrackingByCode(trackingCode).then((remote) => {
        if (alive && remote) setResolved(remote);
      });
    }
    return () => { alive = false; };
  }, [trackingCode, override]);

  if (!resolved) {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-background rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">Rastreio não encontrado</h2>
                <p className="text-muted-foreground mb-6">
                  Não encontramos informações para o código <span className="font-mono font-bold text-foreground">{trackingCode}</span>. Verifique se o código está correto.
                </p>
                <Button onClick={onClose} className="w-full">
                  Tentar Novamente
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[85vh] bg-background rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="gradient-hero p-6 text-primary-foreground">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm opacity-80 mb-1">Código de Rastreio</p>
                  <h2 className="text-2xl font-bold">{resolved.code}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Origin → Destination */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                    <span className="text-sm opacity-80">Origem</span>
                  </div>
                  <p className="font-semibold">{resolved.origin}</p>
                </div>
                <div className="flex-shrink-0">
                  <Navigation className="w-5 h-5 rotate-90" />
                </div>
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 justify-end mb-1">
                    <span className="text-sm opacity-80">Destino</span>
                    <MapPin className="w-3 h-3" />
                  </div>
                  <p className="font-semibold">{resolved.destination}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-foreground/20 rounded-full">
                    <Truck className="w-4 h-4" />
                    <span className="font-medium">{resolved.status}</span>
                  </div>
                  <p className="text-sm opacity-80">
                    Previsão: <span className="font-semibold">{resolved.estimatedDelivery}</span>
                  </p>
                </div>
                
                {resolved.currentLocation && (
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <MapPin className="w-4 h-4" />
                    <span>Está em: <strong>{resolved.currentLocation}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-lg font-semibold text-foreground mb-6">Histórico do Pedido</h3>
              
              <div className="relative">
                {resolved.steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-8 pb-8 last:pb-0"
                  >
                    {/* Vertical line */}
                    {index < resolved.steps.length - 1 && (
                      <div
                        className={`absolute left-[11px] top-8 w-0.5 h-full ${
                          step.isCompleted ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        step.isCurrent
                          ? "gradient-hero shadow-button animate-pulse-soft"
                          : step.isCompleted
                          ? "bg-primary"
                          : "bg-muted border-2 border-border"
                      }`}
                    >
                      {step.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      ) : step.isCurrent ? (
                        <Truck className="w-3 h-3 text-primary-foreground" />
                      ) : (
                        <Clock className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>

                    {/* Content */}
                    <div
                      className={`${
                        step.isCurrent
                          ? "bg-secondary p-4 rounded-lg border border-primary/20"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p
                            className={`font-semibold ${
                              step.isCurrent
                                ? "text-primary"
                                : step.isCompleted
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.status}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {step.location}
                          </p>
                        </div>
                        {step.date !== "-" && (
                          <div className="text-right text-sm text-muted-foreground whitespace-nowrap">
                            <p>{step.date}</p>
                            <p>{step.time}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/50">
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Fechar
                </Button>
                <Button className="flex-1 gradient-hero">
                  Preciso de Ajuda
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TrackingModal;
