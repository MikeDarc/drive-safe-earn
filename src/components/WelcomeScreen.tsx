import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Car, Shield, DollarSign } from "lucide-react";

const slides = [
  {
    icon: DollarSign,
    title: "Maximize seus Ganhos",
    subtitle: "Saiba exatamente quanto você ganha por KM rodado",
    color: "text-primary",
  },
  {
    icon: Shield,
    title: "Dirija com Segurança",
    subtitle: "Câmera discreta para sua proteção em tempo real",
    color: "text-secondary",
  },
  {
    icon: Car,
    title: "Controle Total",
    subtitle: "Monitore corridas, tempo e ganhos em um só lugar",
    color: "text-primary",
  },
];

interface WelcomeScreenProps {
  onStart: () => void;
  onLogin: () => void;
}

const WelcomeScreen = ({ onStart, onLogin }: WelcomeScreenProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-between px-6 py-12">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-gradient-neon mb-2 tracking-tight"
        >
          DriverPro
        </motion.h1>
        <p className="text-muted-foreground text-sm mb-10">Seu copiloto inteligente</p>

        <div className="relative w-full h-64 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center gradient-card rounded-3xl border border-border p-8"
            >
              {(() => {
                const Icon = slides[current].icon;
                return <Icon className={`w-16 h-16 ${slides[current].color} mb-6`} strokeWidth={1.5} />;
              })()}
              <h2 className="text-xl font-bold text-foreground text-center mb-2">{slides[current].title}</h2>
              <p className="text-muted-foreground text-center text-sm">{slides[current].subtitle}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-2 mb-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 gradient-neon" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onStart}
          className="w-full py-4 rounded-2xl gradient-neon text-primary-foreground font-bold text-lg glow-neon flex items-center justify-center gap-2 transition-all"
        >
          Começar <ChevronRight className="w-5 h-5" />
        </motion.button>
        <button onClick={onLogin} className="w-full text-center text-muted-foreground text-sm hover:text-foreground transition-colors">
          Já tenho uma conta / Entrar
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
