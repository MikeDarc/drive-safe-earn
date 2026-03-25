import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, X, DollarSign, MapPin, Clock } from "lucide-react";

interface RideResult {
  valuePerKm: number;
  valuePerHour: number;
  isGood: boolean;
  totalValue: number;
  distance: number;
  time: number;
}

interface MonitoringPopupProps {
  open: boolean;
  onClose: () => void;
  result: RideResult | null;
  minPerKm: string;
  minPerHour: string;
}

const MonitoringPopup = ({ open, onClose, result, minPerKm, minPerHour }: MonitoringPopupProps) => {
  if (!result) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-sm rounded-3xl border-2 p-6 shadow-2xl ${
              result.isGood
                ? "border-primary/50 bg-card glow-neon"
                : "border-destructive/50 bg-card"
            }`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="text-center mb-5">
              <div
                className={`w-16 h-16 rounded-3xl mx-auto mb-3 flex items-center justify-center ${
                  result.isGood ? "gradient-neon" : "bg-destructive"
                }`}
              >
                {result.isGood ? (
                  <ThumbsUp className="w-8 h-8 text-primary-foreground" />
                ) : (
                  <ThumbsDown className="w-8 h-8 text-destructive-foreground" />
                )}
              </div>
              <h2 className={`text-2xl font-extrabold ${result.isGood ? "text-primary" : "text-destructive"}`}>
                {result.isGood ? "Corrida Boa! ✅" : "Corrida Ruim ❌"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {result.isGood ? "Vale a pena aceitar esta corrida" : "Considere recusar esta corrida"}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between bg-muted/50 rounded-2xl p-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Valor</span>
                </div>
                <span className="text-sm font-bold text-foreground">R$ {result.totalValue.toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-2xl p-3 text-center ${
                  result.valuePerKm >= parseFloat(minPerKm) ? "bg-primary/10" : "bg-destructive/10"
                }`}>
                  <p className="text-[10px] text-muted-foreground mb-1">R$ / KM</p>
                  <p className={`text-xl font-extrabold ${
                    result.valuePerKm >= parseFloat(minPerKm) ? "text-primary" : "text-destructive"
                  }`}>
                    {result.valuePerKm.toFixed(2)}
                  </p>
                </div>
                <div className={`rounded-2xl p-3 text-center ${
                  result.valuePerHour >= parseFloat(minPerHour) ? "bg-primary/10" : "bg-destructive/10"
                }`}>
                  <p className="text-[10px] text-muted-foreground mb-1">R$ / Hora</p>
                  <p className={`text-xl font-extrabold ${
                    result.valuePerHour >= parseFloat(minPerHour) ? "text-primary" : "text-destructive"
                  }`}>
                    {result.valuePerHour.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-2xl p-3">
                  <MapPin className="w-3 h-3 text-secondary" />
                  <span className="text-xs text-muted-foreground">{result.distance} km</span>
                </div>
                <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-2xl p-3">
                  <Clock className="w-3 h-3 text-secondary" />
                  <span className="text-xs text-muted-foreground">{result.time} min</span>
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className={`w-full mt-5 py-3 rounded-2xl font-bold text-sm ${
                result.isGood
                  ? "gradient-neon text-primary-foreground glow-neon"
                  : "bg-destructive text-destructive-foreground"
              }`}
            >
              {result.isGood ? "Aceitar Corrida" : "Recusar Corrida"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MonitoringPopup;