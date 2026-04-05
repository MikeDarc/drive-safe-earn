const SETTINGS_KEY = "driverpro_settings";

export interface DriverSettings {
  minPerKm: string;
  minPerHour: string;
  maxTime: string;
}

const defaults: DriverSettings = {
  minPerKm: "2.00",
  minPerHour: "25.00",
  maxTime: "30",
};

export function loadSettings(): DriverSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {}
  return { ...defaults };
}

export function saveSettings(s: DriverSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}
