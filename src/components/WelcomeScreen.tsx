import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Car, Shield, DollarSign, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      toast({ title: "Preencha todos os campos", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "A senha deve ter pelo menos 6 caracteres", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Login realizado com sucesso!" });
        onLogin();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: "Conta criada! Verifique seu email para confirmar." });
        onStart();
      }
    } catch (error: any) {
      toast({ title: error.message || "Erro ao autenticar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-between px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl sm:text-3xl font-extrabold text-gradient-neon mb-2 tracking-tight"
        >
          DriverPro
        </motion.h1>
        <p className="text-muted-foreground text-xs sm:text-sm mb-6 sm:mb-10">Seu copiloto inteligente</p>

        <AnimatePresence mode="wait">
          {!showAuth ? (
            <motion.div key="carousel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
              <div className="relative w-full h-52 sm:h-64 mb-6 sm:mb-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 flex flex-col items-center justify-center gradient-card rounded-3xl border border-border p-6 sm:p-8"
                  >
                    {(() => {
                      const Icon = slides[current].icon;
                      return <Icon className={`w-12 h-12 sm:w-16 sm:h-16 ${slides[current].color} mb-4 sm:mb-6`} strokeWidth={1.5} />;
                    })()}
                    <h2 className="text-lg sm:text-xl font-bold text-foreground text-center mb-2">{slides[current].title}</h2>
                    <p className="text-muted-foreground text-center text-xs sm:text-sm">{slides[current].subtitle}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-2 mb-6 sm:mb-10 justify-center">
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
            </motion.div>
          ) : (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full gradient-card rounded-3xl border border-border p-5 sm:p-6 mb-6"
            >
              <h3 className="text-lg font-bold text-foreground mb-1">
                {isLogin ? "Entrar na conta" : "Criar conta"}
              </h3>
              <p className="text-xs text-muted-foreground mb-5">
                {isLogin ? "Bem-vindo de volta!" : "Comece a maximizar seus ganhos"}
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-muted border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAuth}
                disabled={loading}
                className="w-full py-3 mt-4 rounded-2xl gradient-neon text-primary-foreground font-bold text-sm glow-neon flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isLogin ? "Entrar" : "Criar Conta"}
              </motion.button>

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center text-muted-foreground text-xs mt-3 hover:text-foreground transition-colors"
              >
                {isLogin ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-sm space-y-3 sm:space-y-4">
        {!showAuth && (
          <>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setShowAuth(true); setIsLogin(false); }}
              className="w-full py-3.5 sm:py-4 rounded-2xl gradient-neon text-primary-foreground font-bold text-base sm:text-lg glow-neon flex items-center justify-center gap-2 transition-all"
            >
              Começar <ChevronRight className="w-5 h-5" />
            </motion.button>
            <button
              onClick={() => { setShowAuth(true); setIsLogin(true); }}
              className="w-full text-center text-muted-foreground text-xs sm:text-sm hover:text-foreground transition-colors"
            >
              Já tenho uma conta / Entrar
            </button>
          </>
        )}
        {showAuth && (
          <button
            onClick={() => setShowAuth(false)}
            className="w-full text-center text-muted-foreground text-xs sm:text-sm hover:text-foreground transition-colors"
          >
            ← Voltar
          </button>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
