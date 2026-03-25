import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, DollarSign, Power, Radio, TrendingUp, Zap } from "lucide-react";
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
  const [minPerKm, setMinPerKm] = useState("2.00");
  const [minPerHour, setMinPerHour] = useState("25.00");
  const [maxTime, setMaxTime] = useState("30");
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupResult, setPopupResult] = useState<RideResult | null>(null);
  const [rideValue, setRideValue] = useState("");
  const [rideDistance, setRideDistance] = useState("");
  const [rideTime, setRideTime] = useState("");
  const [history, setHistory] = useState<RideResult[]>([]);

  const evaluate = () => {
    const val = parseFloat(rideValue);
    const dist = parseFloat(rideDistance);
    const t = parseFloat(rideTime);
    if (!val || !dist || !t || val <= 0 || dist <= 0 || t <= 0) return;

    const valuePerKm = val / dist;
    const valuePerHour = (val / t) * 60;
    const minKm = parseFloat(minPerKm) || 2;
    const minHr = parseFloat(minPerHour) || 25;
    const mTime = parseFloat(maxTime) || 30;
    const isGood = valuePerKm >= minKm && valuePerHour >= minHr && t <= mTime;

    const r: RideResult = { valuePerKm, valuePerHour, isGood, totalValue: val, distance: dist, time: t };
    setPopupResult(r);
    setShowPopup(true);
    setHistory((prev) => [r, ...prev].slice(0, 20));
    setRideValue("");
    setRideDistance("");
    setRideTime("");
  };

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      <MonitoringPopup
        open={showPopup}
        onClose={() => setShowPopup(false)}
        result={popupResult}
        minPerKm={minPerKm}
        minPerHour={minPerHour}
      />

      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Monitoramento de Ganhos</h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">Configure seus valores ideais e avalie corridas</p>
      </div>

      {/* Preferências do Motorista */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-card rounded-3xl border border-border p-4 sm:p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Seus Valores Ideais
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Valor mínimo por KM (R$)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="Ex: 2.00"
                value={minPerKm}
                onChange={(e) => setMinPerKm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Valor mínimo por Hora (R$)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="Ex: 25.00"
                value={minPerHour}
                onChange={(e) => setMinPerHour(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Tempo máximo de corrida (min)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="number"
                inputMode="numeric"
                placeholder="Ex: 30"
                value={maxTime}
                onChange={(e) => setMaxTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Monitoramento Toggle */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-3xl border p-4 sm:p-5 transition-all ${
          monitoringActive ? "border-primary/50 glow-neon gradient-card" : "gradient-card border-border"
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
                {monitoringActive ? "Monitoramento Ativo" : "Ativar Monitoramento"}
              </h3>
              <p className="text-[10px] text-muted-foreground">
                {monitoringActive ? "Insira os dados da corrida abaixo" : "Avalie corridas com seus valores ideais"}
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
      </motion.div>

      {/* Entrada rápida da corrida (visível quando monitoramento ativo) */}
      <AnimatePresence>
        {monitoringActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="gradient-card rounded-3xl border border-primary/20 p-4 sm:p-5 space-y-3"
          >
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Dados da Corrida
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="Valor da corrida (R$)"
                  value={rideValue}
                  onChange={(e) => setRideValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="Distância (km)"
                    value={rideDistance}
                    onChange={(e) => setRideDistance(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="Tempo (min)"
                    value={rideTime}
                    onChange={(e) => setRideTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={evaluate}
                className="w-full py-3 rounded-2xl gradient-neon text-primary-foreground font-bold text-sm glow-neon flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Avaliar Corrida
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Histórico */}
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
