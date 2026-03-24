import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import WelcomeScreen from "../components/WelcomeScreen";
import PermissionsScreen from "../components/PermissionsScreen";
import Dashboard from "../components/Dashboard";

type Screen = "welcome" | "permissions" | "dashboard";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("welcome");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && screen === "welcome") {
        setScreen("dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setScreen("dashboard");
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen">
      {screen === "welcome" && (
        <WelcomeScreen
          onStart={() => setScreen("permissions")}
          onLogin={() => setScreen("dashboard")}
        />
      )}
      {screen === "permissions" && (
        <PermissionsScreen onContinue={() => setScreen("dashboard")} />
      )}
      {screen === "dashboard" && <Dashboard />}
    </div>
  );
};

export default Index;
