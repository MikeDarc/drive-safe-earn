import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Bell,
  Layers,
  BatteryCharging,
  Camera,
  Accessibility,
  ChevronRight,
  Check,
} from "lucide-react";
import { loadSettings, saveSettings, type DriverSettings } from "@/lib/settings";
import {
  requestNotificationPermission,
  requestOverlayPermission,
  requestBatteryOptimization,
  requestCameraPermission,
  requestAccessibilityPermission,
} from "@/lib/native-permissions";

const SettingsTab = () => {
  const [settings, setSettings] = useState<DriverSettings>(loadSettings);
  const [permStates, setPermStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const update = (key: keyof DriverSettings, val: string) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  const handlePermission = async (id: string, fn: () => Promise<boolean>) => {
    const granted = await fn();
    setPermStates((prev) => ({ ...prev, [id]: granted }));
  };

  const permissions = [
    {
      id: "notifications",
      icon: Bell,
      title: "Notificações",
      description: "Alertas de ganhos e corridas em tempo real",
      action: () => handlePermission("notifications", requestNotificationPermission),
    },
    {
      id: "overlay",
      icon: Layers,
      title: "Sobrepor outros apps",
      description: "Exibir popup sobre Uber/99 ao receber corrida",
      action: () => handlePermission("overlay", requestOverlayPermission),
    },
    {
      id: "battery",
      icon: BatteryCharging,
      title: "Otimização de Bateria",
      description: "Manter monitoramento ativo em segundo plano",
      action: () => handlePermission("battery", requestBatteryOptimization),
    },
    {
      id: "camera",
      icon: Camera,
      title: "Câmera",
      description: "Gravar corridas e salvar na galeria",
      action: () => handlePermission("camera", requestCameraPermission),
    },
    {
      id: "accessibility",
      icon: Accessibility,
      title: "Acessibilidade",
      description: "Permitir leitura de tela para avaliar corridas",
      action: () => handlePermission("accessibility", requestAccessibilityPermission),
    },
  ];

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">Configurações</h2>
        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
          Seus valores ideais e permissões do app
        </p>
      </div>

      {/* Valores Ideais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-card rounded-3xl border border-border p-4 sm:p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Valores Ideais de Corrida
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Valor mínimo por KM (R$)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="Ex: 2.00"
                value={settings.minPerKm}
                onChange={(e) => update("minPerKm", e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Valor mínimo por Hora (R$)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <input
                type="number"
                inputMode="decimal"
                placeholder="Ex: 25.00"
                value={settings.minPerHour}
                onChange={(e) => update("minPerHour", e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Tempo máximo de corrida (min)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <input
                type="number"
                inputMode="numeric"
                placeholder="Ex: 30"
                value={settings.maxTime}
                onChange={(e) => update("maxTime", e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Permissões */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="gradient-card rounded-3xl border border-border p-4 sm:p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3">Permissões do App</h3>
        <div className="space-y-3">
          {permissions.map((perm, i) => {
            const Icon = perm.icon;
            const granted = permStates[perm.id] ?? false;
            return (
              <motion.button
                key={perm.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={perm.action}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-muted/50 hover:bg-muted transition-colors text-left"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    granted ? "gradient-neon" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${granted ? "text-primary-foreground" : "text-muted-foreground"}`}
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{perm.title}</p>
                  <p className="text-[10px] text-muted-foreground">{perm.description}</p>
                </div>
                {granted ? (
                  <Check className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsTab;
