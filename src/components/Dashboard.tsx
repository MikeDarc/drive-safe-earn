import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EarningsTab from "./EarningsTab";
import CameraTab from "./CameraTab";
import { DollarSign, Camera, Settings } from "lucide-react";

const tabs = [
  { id: "earnings", label: "Ganhos", icon: DollarSign },
  { id: "camera", label: "Câmera", icon: Camera },
  { id: "settings", label: "Config", icon: Settings },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("earnings");

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {activeTab === "earnings" && (
            <motion.div key="earnings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <EarningsTab />
            </motion.div>
          )}
          {activeTab === "camera" && (
            <motion.div key="camera" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <CameraTab />
            </motion.div>
          )}
          {activeTab === "settings" && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="px-6 py-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Configurações</h2>
              <div className="gradient-card rounded-3xl border border-border p-5">
                <p className="text-muted-foreground text-sm">Em breve: Personalize suas preferências aqui.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-xl safe-area-bottom">
        <div className="flex justify-around items-center py-3 max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center gap-1 relative px-4 py-1"
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-3 w-12 h-1 rounded-full gradient-neon"
                  />
                )}
                <Icon
                  className={`w-6 h-6 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
