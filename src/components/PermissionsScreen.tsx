import { motion } from "framer-motion";
import { Bell, Layers, BatteryCharging, ChevronRight } from "lucide-react";
import { useState } from "react";

const permissions = [
  {
    id: "notifications",
    icon: Bell,
    title: "Notificações de Ganhos",
    description: "Receba alertas quando atingir suas metas diárias",
  },
  {
    id: "overlay",
    icon: Layers,
    title: "Sobrepor a outros apps",
    description: "Veja seus ganhos em tempo real sobre o app de corrida",
  },
  {
    id: "battery",
    icon: BatteryCharging,
    title: "Otimização de Bateria",
    description: "Mantenha o monitoramento ativo em segundo plano",
  },
];

interface PermissionsScreenProps {
  onContinue: () => void;
}

const PermissionsScreen = ({ onContinue }: PermissionsScreenProps) => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col min-h-screen px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Configurações</h1>
        <p className="text-muted-foreground text-sm">Ative as permissões para melhor experiência</p>
      </motion.div>

      <div className="space-y-4 flex-1">
        {permissions.map((perm, i) => {
          const Icon = perm.icon;
          const isOn = enabled[perm.id] ?? false;
          return (
            <motion.div
              key={perm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="gradient-card rounded-3xl border border-border p-5 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isOn ? "gradient-neon" : "bg-muted"} transition-all`}>
                <Icon className={`w-6 h-6 ${isOn ? "text-primary-foreground" : "text-muted-foreground"}`} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{perm.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{perm.description}</p>
              </div>
              <button
                onClick={() => toggle(perm.id)}
                className={`w-12 h-7 rounded-full relative transition-all duration-300 ${isOn ? "gradient-neon glow-neon" : "bg-muted"}`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-foreground transition-all duration-300 ${
                    isOn ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="w-full py-4 rounded-2xl gradient-neon text-primary-foreground font-bold text-lg glow-neon flex items-center justify-center gap-2 mt-8"
      >
        Continuar <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default PermissionsScreen;
