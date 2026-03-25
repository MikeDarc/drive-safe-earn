import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, TrendingUp, Clock, MapPin, DollarSign, ThumbsUp, ThumbsDown, RotateCcw, Power, Radio } from "lucide-react";
import MonitoringPopup from "./MonitoringPopup";

interface RideResult {
  valuePerKm: number;
  valuePerHour: number;
  isGood: boolean;
  totalValue: number;
  distance: number;
  time: number;
}

const EarningsTab = () => {
  const [rideValue, setRideValue] = useState("");
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const [minPerKm, setMinPerKm] = useState("2.00");
  const [minPerHour, setMinPerHour] = useState("25.00");
  const [result, setResult] = useState<RideResult | null>(null);
  const [history, setHistory] = useState<RideResult[]>([]);
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupResult, setPopupResult] = useState<RideResult | null>(null);

  const calculate = () => {
    const val = parseFloat(rideValue);
    const dist = parseFloat(distance);
    const t = parseFloat(time);

    if (!val || !dist || !t || val <= 0 || dist <= 0 || t <= 0) return;

    const valuePerKm = val / dist;
    const valuePerHour = (val / t) * 60;
    const minKm = parseFloat(minPerKm) || 2;
    const minHr = parseFloat(minPerHour) || 25;
    const isGood = valuePerKm >= minKm && valuePerHour >= minHr;

    const r: RideResult = { valuePerKm, valuePerHour, isGood, totalValue: val, distance: dist, time: t };
    setResult(r);
    setHistory((prev) => [r, ...prev].slice(0, 10));

    if (monitoringActive) {
      setPopupResult(r);
      setShowPopup(true);
    }
  };

  const reset = () => {
    setRideValue("");
    setDistance("");
    setTime("");
    setResult(null);
  };

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      {/* Monitoring Popup */}
      <MonitoringPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        result={popupResult}
        minPerKm={minPerKm}
        minPerHour={minPerHour}
      />

      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Calculadora de Corrida</h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">Descubra se a corrida vale a pena</p>
      </div>

      {/* Monitoring Toggle */}
      <motion.div
        layout
        className={`rounded-3xl border p-4 sm:p-5 transition-all ${
          monitoringActive
            ? "border-primary/50 glow-neon gradient-card"
            : "gradient-card border-border"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
              monitoringActive ? "gradient-neon" : "bg-muted"
            }`}>
              {monitoringActive ? (
                <Radio className="w-5 h-5 text-primary-foreground animate-pulse" />
              ) : (
                <Power className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {monitoringActive ? "Monitoramento Ativo" : "Monitoramento"}
              </h3>
              <p className="text-[10px] text-muted-foreground">
                {monitoringActive
                  ? "Popup automático ao calcular"
                  : "Ative para ver popups de resultado"}
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMonitoringActive(!monitoringActive)}
            className={`relative w-14 h-8 rounded-full transition-colors ${
              monitoringActive ? "bg-primary" : "bg-muted"
            }`}
          >
            <motion.div
              layout
              className={`absolute top-1 w-6 h-6 rounded-full shadow-md ${
                monitoringActive ? "right-1 bg-primary-foreground" : "left-1 bg-muted-foreground"
              }`}
            />
          </motion.button>
        </div>
        {monitoringActive && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-[10px] text-primary mt-3 bg-primary/10 rounded-xl p-2 text-center"
          >
            ⚡ Preencha os dados e clique em Calcular para ver o popup automático
          </motion.p>
        )}
      </motion.div>

      {/* Calculator Form */}
      <motion.div layout className="gradient-card rounded-3xl border border-border p-4 sm:p-5 space-y-3">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Valor da corrida (R$)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="Ex: 15.00"
                value={rideValue}
                onChange={(e) => setRideValue(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Distância (km)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="Ex: 8.5"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Tempo estimado (minutos)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="Ex: 20"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={calculate}
            className="flex-1 py-3 rounded-2xl gradient-neon text-primary-foreground font-bold text-sm glow-neon flex items-center justify-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Calcular
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={reset}
            className="px-4 py-3 rounded-2xl bg-muted border border-border text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`rounded-3xl border p-4 sm:p-5 ${
              result.isGood
                ? "border-primary/30 glow-neon gradient-card"
                : "border-destructive/30 gradient-card"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  result.isGood ? "gradient-neon" : "bg-destructive"
                }`}
              >
                {result.isGood ? (
                  <ThumbsUp className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <ThumbsDown className="w-6 h-6 text-destructive-foreground" />
                )}
              </div>
              <div>
                <h3 className={`text-lg font-extrabold ${result.isGood ? "text-primary" : "text-destructive"}`}>
                  {result.isGood ? "Corrida Boa! ✅" : "Corrida Ruim ❌"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {result.isGood ? "Vale a pena aceitar" : "Considere recusar"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-2xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">R$ / KM</p>
                <p className={`text-xl font-extrabold ${result.valuePerKm >= parseFloat(minPerKm) ? "text-primary" : "text-destructive"}`}>
                  {result.valuePerKm.toFixed(2)}
                </p>
                <p className="text-[10px] text-muted-foreground">mín: R$ {minPerKm}</p>
              </div>
              <div className="bg-muted/50 rounded-2xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">R$ / Hora</p>
                <p className={`text-xl font-extrabold ${result.valuePerHour >= parseFloat(minPerHour) ? "text-primary" : "text-destructive"}`}>
                  {result.valuePerHour.toFixed(2)}
                </p>
                <p className="text-[10px] text-muted-foreground">mín: R$ {minPerHour}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="gradient-card rounded-3xl border border-border p-4 sm:p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Valores Mínimos Aceitáveis
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Mín R$/KM</label>
            <input
              type="number"
              inputMode="decimal"
              value={minPerKm}
              onChange={(e) => setMinPerKm(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground mb-1 block">Mín R$/Hora</label>
            <input
              type="number"
              inputMode="decimal"
              value={minPerHour}
              onChange={(e) => setMinPerHour(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-card rounded-3xl border border-border p-4 sm:p-5"
        >
          <h3 className="text-sm font-semibold text-foreground mb-3">Histórico Recente</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {history.map((h, i) => (
              <div
                key={i}
                className={`flex items-center justify-between py-2 px-3 rounded-xl ${
                  h.isGood ? "bg-primary/10" : "bg-destructive/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  {h.isGood ? (
                    <ThumbsUp className="w-3 h-3 text-primary" />
                  ) : (
                    <ThumbsDown className="w-3 h-3 text-destructive" />
                  )}
                  <span className="text-xs text-foreground">R$ {h.totalValue.toFixed(2)}</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[10px] text-muted-foreground">{h.distance}km</span>
                  <span className="text-[10px] text-muted-foreground">{h.time}min</span>
                  <span className={`text-[10px] font-bold ${h.isGood ? "text-primary" : "text-destructive"}`}>
                    R${h.valuePerKm.toFixed(2)}/km
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EarningsTab;
