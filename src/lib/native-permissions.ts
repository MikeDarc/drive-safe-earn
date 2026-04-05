/**
 * Native permission helpers for Capacitor/Android.
 * These call native intents via Capacitor plugins.
 * On web, they gracefully degrade to browser APIs or no-ops.
 */

import { Capacitor } from "@capacitor/core";

const isNative = () => Capacitor.isNativePlatform();

/** Request notification permission */
export async function requestNotificationPermission(): Promise<boolean> {
  if (isNative()) {
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      const result = await LocalNotifications.requestPermissions();
      return result.display === "granted";
    } catch {
      // Fallback to web API
    }
  }
  if ("Notification" in window) {
    const result = await Notification.requestPermission();
    return result === "granted";
  }
  return false;
}

/** Request overlay permission (Android only) */
export async function requestOverlayPermission(): Promise<boolean> {
  if (isNative()) {
    try {
      // This requires the custom DriverPro plugin (see native plugin instructions)
      const { DriverProPlugin } = await import("./capacitor-driverpro");
      await DriverProPlugin.requestOverlayPermission();
      return true;
    } catch {
      console.warn("Overlay permission not available");
    }
  }
  return false;
}

/** Request battery optimization exemption (Android only) */
export async function requestBatteryOptimization(): Promise<boolean> {
  if (isNative()) {
    try {
      const { DriverProPlugin } = await import("./capacitor-driverpro");
      await DriverProPlugin.requestBatteryOptimization();
      return true;
    } catch {
      console.warn("Battery optimization not available");
    }
  }
  return false;
}

/** Request camera permission */
export async function requestCameraPermission(): Promise<boolean> {
  if (isNative()) {
    try {
      const { Camera } = await import("@capacitor/camera");
      const result = await Camera.requestPermissions({ permissions: ["camera"] });
      return result.camera === "granted";
    } catch {
      console.warn("Camera permission not available");
    }
  }
  // Web fallback
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

/** Open accessibility settings (Android only) */
export async function requestAccessibilityPermission(): Promise<boolean> {
  if (isNative()) {
    try {
      const { DriverProPlugin } = await import("./capacitor-driverpro");
      await DriverProPlugin.openAccessibilitySettings();
      return true;
    } catch {
      console.warn("Accessibility settings not available");
    }
  }
  return false;
}
