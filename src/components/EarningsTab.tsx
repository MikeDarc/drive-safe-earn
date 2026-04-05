import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Radio, Zap, AlertTriangle, Smartphone } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import MonitoringPopup from "./MonitoringPopup";
import { loadSettings } from "@/lib/settings";

interface RideResult {
  valuePerKm: number;
  valuePerHour: number;
  isGood: boolean;
  totalValue: number;
  distance: number;
  time: number;
}

const EarningsTab = () => {
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupResult, setPopupResult] = useState<RideResult | null>(null);
  const [history, setHistory] = useState<RideResult[]>([]);
  const settings = loadSettings();

  const isNative = Capacitor.isNativePlatform();

  // Listen for ride offers from the native accessibility service
  useEffect(() => {
    if (!monitoringActive || !isNative) return;

    let removeListener: (() => void) | null = null;

    const setup = async () => {
      try {
        const { DriverProPlugin } = await import("@/lib/capacitor-driverpro");
        await DriverProPlugin.startMonitoring();

        const listener = await DriverProPlugin.addListener("rideOfferDetected", (offer) => {
          const s = loadSettings();
          const minKm = parseFloat(s.minPerKm) || 2;
          const minHr = parseFloat(s.minPerHour) || 25;
          const mTime = parseFloat(s.maxTime) || 30;

          const valuePerKm = offer.value / offer.distance;
          const valuePerHour = (offer.value / offer.time) * 60;
          const isGood = valuePerKm >= minKm && valuePerHour >= minHr && offer.time <= mTime;

          const result: RideResult = {
            valuePerKm,
            valuePerHour,
            isGood,
            totalValue: offer.value,
            distance: offer.distance,
            time: offer.time,
          };

          setPopupResult(result);
          setShowPopup(true);
          setHistory((prev) => [result, ...prev].slice(0, 20));
        });

        removeListener = listener.remove;
      } catch (err) {
        console.warn("Native monitoring not available:", err);
      }
    };

    setup();

    return () => {
      removeListener?.();
      if (isNative) {
        import("@/lib/capacitor-driverpro").then(({ DriverProPlugin }) =>
          DriverProPlugin.stopMonitoring().catch(() => {})
        );
      }
    };
  }, [monitoringActive, isNative]);

  const toggleMonitoring = () => setMonitoringActive(!monitoringActive);

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      <MonitoringPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        result={popupResult}
        minPerKm={settings.minPerKm}
        minPerHour={settings.minPerHour}
      />

      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Monitoramento de Ganhos</h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
          Ative para avaliar corridas automaticamente
        </p>
      </div>

      {/* Main Monitoring Toggle */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl border p-5 sm:p-6 transition-all ${
          monitoringActive ? "border-primary/50 glow-neon gradient-card" : "gradient-card border-border"
        }`}
      >
        <div className="flex flex-col items-center text-center gap-4">
          <motion.div
            animate={monitoringActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all ${
              monitoringActive ? "gradient-neon glow-neon" : "bg-muted"
            }`}
          >
            {monitoringActive ? (
              <Radio className="w-10 h-10 text-primary-foreground" />
            ) : (
              <Power className="w-10 h-10 text-muted-foreground" />
            )}
          </motion.div>

          <div>
            <h3 className="text-lg font-bold text-foreground">
              {monitoringActive ? "Monitoramento Ativo" : "Monitoramento Inativo"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {monitoringActive
                ? "Avaliando corridas em tempo real"
                : "Toque para começar a monitorar"}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleMonitoring}
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
              monitoringActive
                ? "bg-destructive text-destructive-foreground"
                : "gradient-neon text-primary-foreground glow-neon"
            }`}
          >
            {monitoringActive ? (
              <>
                <Power className="w-5 h-5" /> Desativar
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" /> Ativar Monitoramento
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Status info */}
      <AnimatePresence>
        {monitoringActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {!isNative && (
              <div className="gradient-card rounded-2xl border border-border p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Modo Web</p>
                  <p className="text-[10px] text-muted-foreground">
                    A leitura automática de tela requer o app nativo instalado. Instale o APK para
                    monitoramento automático do Uber/99.
                  </p>
                </div>
              </div>
            )}

            <div className="gradient-card rounded-2xl border border-primary/20 p-4 flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">Como funciona</p>
                <p className="text-[10px] text-muted-foreground">
                  O app lê as informações da corrida no Uber/99, compara com seus valores ideais
                  (configurados em Config) e mostra um popup instantâneo dizendo se vale a pena aceitar.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gradient-card rounded-3xl border border-border p-4 sm:p-5"
          >
            <h3 className="text-sm font-semibold text-foreground mb-3">Histórico</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((h, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between py-2 px-3 rounded-xl text-xs ${
                    h.isGood ? "bg-primary/10" : "bg-destructive/10"
                  }`}
                >
                  <span className={`font-bold ${h.isGood ? "text-primary" : "text-destructive"}`}>
                    {h.isGood ? "✅" : "❌"} R$ {h.totalValue.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">
                    {h.distance}km · {h.time}min · R${h.valuePerKm.toFixed(2)}/km
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EarningsTab;
