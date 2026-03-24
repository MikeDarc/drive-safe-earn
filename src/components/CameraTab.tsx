import { useState } from "react";
import { motion } from "framer-motion";
import { Video, VideoOff, Circle, Shield } from "lucide-react";

const CameraTab = () => {
  const [recording, setRecording] = useState(false);

  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Câmera de Segurança</h2>
        <p className="text-muted-foreground text-sm mt-1">Gravação discreta para sua proteção</p>
      </div>

      {/* Camera Preview */}
      <motion.div
        layout
        className={`rounded-3xl border overflow-hidden transition-all duration-500 ${
          recording ? "border-destructive/40" : "border-border"
        }`}
      >
        <div className="relative aspect-[4/3] bg-muted/50 flex items-center justify-center">
          {recording ? (
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/80 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Circle className="w-3 h-3 text-destructive fill-destructive animate-pulse" />
                <span className="text-sm font-semibold text-destructive">REC</span>
              </div>
              <p className="text-xs text-muted-foreground">00:42:18</p>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-card/60 backdrop-blur flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <VideoOff className="w-12 h-12 text-muted-foreground" strokeWidth={1} />
              <p className="text-sm text-muted-foreground">Câmera desativada</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setRecording(!recording)}
        className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
          recording
            ? "bg-destructive text-destructive-foreground"
            : "gradient-neon text-primary-foreground glow-neon"
        }`}
      >
        {recording ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        {recording ? "Parar Gravação" : "Ativar Câmera Secreta"}
      </motion.button>

      <div className="gradient-card rounded-3xl border border-border p-5 flex items-start gap-3">
        <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-foreground">Modo Discreto</h4>
          <p className="text-xs text-muted-foreground mt-1">
            A gravação funciona em segundo plano sem notificação visível. Seus vídeos ficam salvos com segurança.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CameraTab;
