/**
 * DriverPro Custom Capacitor Plugin Interface
 * 
 * This defines the TypeScript interface for native Android functionality.
 * The actual native code must be implemented in Kotlin/Java in the Android project.
 * 
 * See /docs/NATIVE_PLUGIN_SETUP.md for implementation instructions.
 */

import { registerPlugin } from "@capacitor/core";

export interface RideOffer {
  value: number;       // Valor da corrida em R$
  distance: number;    // Distância em km
  time: number;        // Tempo estimado em minutos
  app: "uber" | "99" | "unknown";
}

export interface DriverProPluginInterface {
  /** Request SYSTEM_ALERT_WINDOW permission */
  requestOverlayPermission(): Promise<void>;

  /** Request ignore battery optimizations */
  requestBatteryOptimization(): Promise<void>;

  /** Open Android accessibility settings */
  openAccessibilitySettings(): Promise<void>;

  /** Start the accessibility service monitoring */
  startMonitoring(): Promise<void>;

  /** Stop the accessibility service monitoring */
  stopMonitoring(): Promise<void>;

  /** Check if accessibility service is enabled */
  isAccessibilityEnabled(): Promise<{ enabled: boolean }>;

  /** Add listener for ride offers detected by the accessibility service */
  addListener(
    eventName: "rideOfferDetected",
    listenerFunc: (offer: RideOffer) => void
  ): Promise<{ remove: () => void }>;
}

export const DriverProPlugin = registerPlugin<DriverProPluginInterface>("DriverProPlugin");
