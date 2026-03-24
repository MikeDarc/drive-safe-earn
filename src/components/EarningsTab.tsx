import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Clock, MapPin, Zap } from "lucide-react";

const EarningsTab = () => {
  const [monitoring, setMonitoring] = useState(false);

  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Painel de Ganhos</h2>
        <p className="text-muted-foreground text-sm mt-1">Acompanhe suas corridas em tempo real</p>
      </div>

      {/* Status Card */}
      <motion.div
        layout
        className={`rounded-3xl border p-6 transition-all duration-500 ${
          monitoring
            ? "border-primary/30 glow-neon gradient-card"
            : "border-border gradient-card"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${monitoring ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
            <span className="text-sm font-semibold text-foreground">
              {monitoring ? "Monitorando..." : "Offline"}
            </span>
          </div>
          <Activity className={`w-5 h-5 ${monitoring ? "text-primary" : "text-muted-foreground"}`} />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setMonitoring(!monitoring)}
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            monitoring
              ? "bg-muted text-foreground"
              : "gradient-neon text-primary-foreground glow-neon"
          }`}
        >
          <Zap className="w-5 h-5" />
          {monitoring ? "Pausar Monitoramento" : "Ativar Monitoramento"}
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="gradient-card rounded-3xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl gradient-neon flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground">R$ 2,45</p>
          <p className="text-xs text-muted-foreground mt-1">por KM rodado</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gradient-card rounded-3xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl gradient-blue flex items-center justify-center">
              <Clock className="w-4 h-4 text-foreground" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground">8 min</p>
          <p className="text-xs text-muted-foreground mt-1">tempo em espera</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="gradient-card rounded-3xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl gradient-blue flex items-center justify-center">
              <MapPin className="w-4 h-4 text-foreground" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground">142 km</p>
          <p className="text-xs text-muted-foreground mt-1">rodados hoje</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="gradient-card rounded-3xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl gradient-neon flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-foreground">R$ 347</p>
          <p className="text-xs text-muted-foreground mt-1">ganhos do dia</p>
        </motion.div>
      </div>
    </div>
  );
};

export default EarningsTab;
