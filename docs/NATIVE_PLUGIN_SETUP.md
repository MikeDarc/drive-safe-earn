# DriverPro - Guia de Implementação do Plugin Nativo Android

## Visão Geral

O DriverPro usa um plugin Capacitor customizado (`DriverProPlugin`) para funcionalidades nativas:
- **Overlay Permission**: Exibir popup sobre outros apps
- **Battery Optimization**: Manter app ativo em segundo plano
- **Accessibility Service**: Ler tela do Uber/99 para avaliar corridas automaticamente

## Passo 1: Criar o Plugin no Android

Após rodar `npx cap add android` e `npx cap sync`, crie o plugin:

### 1.1 Criar `DriverProPlugin.kt`

**Caminho:** `android/app/src/main/java/app/lovable/ab4d3549aaf94cc191d476f3ac733589/DriverProPlugin.kt`

```kotlin
package app.lovable.ab4d3549aaf94cc191d476f3ac733589

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "DriverProPlugin")
class DriverProPlugin : Plugin() {

    @PluginMethod
    fun requestOverlayPermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:${activity.packageName}")
            )
            activity.startActivity(intent)
        }
        call.resolve()
    }

    @PluginMethod
    fun requestBatteryOptimization(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
                data = Uri.parse("package:${activity.packageName}")
            }
            activity.startActivity(intent)
        }
        call.resolve()
    }

    @PluginMethod
    fun openAccessibilitySettings(call: PluginCall) {
        val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
        activity.startActivity(intent)
        call.resolve()
    }

    @PluginMethod
    fun startMonitoring(call: PluginCall) {
        // O monitoramento real é feito pelo AccessibilityService
        // Este método apenas sinaliza para o serviço começar
        ScreenReaderService.isMonitoring = true
        call.resolve()
    }

    @PluginMethod
    fun stopMonitoring(call: PluginCall) {
        ScreenReaderService.isMonitoring = false
        call.resolve()
    }

    @PluginMethod
    fun isAccessibilityEnabled(call: PluginCall) {
        val enabled = isAccessibilityServiceEnabled()
        val ret = com.getcapacitor.JSObject()
        ret.put("enabled", enabled)
        call.resolve(ret)
    }

    private fun isAccessibilityServiceEnabled(): Boolean {
        val service = "${activity.packageName}/.ScreenReaderService"
        val enabledServices = Settings.Secure.getString(
            activity.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
        ) ?: return false
        return enabledServices.contains(service)
    }

    // Chamado pelo AccessibilityService quando detecta uma corrida
    fun notifyRideOffer(value: Double, distance: Double, time: Double, app: String) {
        val data = com.getcapacitor.JSObject().apply {
            put("value", value)
            put("distance", distance)
            put("time", time)
            put("app", app)
        }
        notifyListeners("rideOfferDetected", data)
    }
}
```

### 1.2 Criar `ScreenReaderService.kt` (Accessibility Service)

**Caminho:** `android/app/src/main/java/app/lovable/ab4d3549aaf94cc191d476f3ac733589/ScreenReaderService.kt`

```kotlin
package app.lovable.ab4d3549aaf94cc191d476f3ac733589

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class ScreenReaderService : AccessibilityService() {

    companion object {
        var isMonitoring = false
        var pluginInstance: DriverProPlugin? = null
    }

    override fun onServiceConnected() {
        val info = AccessibilityServiceInfo().apply {
            eventTypes = AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED or
                         AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
            // Monitorar apenas Uber e 99
            packageNames = arrayOf(
                "com.ubercab.driver",           // Uber Driver
                "com.nineninetaxi.driver",       // 99 Motorista
                "br.com.driver99"                // 99 Driver alternativo
            )
            notificationTimeout = 100
        }
        serviceInfo = info
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (!isMonitoring || event == null) return

        val source = event.source ?: return
        val packageName = event.packageName?.toString() ?: return

        // Tentar extrair dados da corrida
        val rideData = when {
            packageName.contains("uber") -> parseUberRide(source)
            packageName.contains("99") || packageName.contains("ninenine") -> parse99Ride(source)
            else -> null
        }

        rideData?.let { (value, distance, time) ->
            val app = if (packageName.contains("uber")) "uber" else "99"
            pluginInstance?.notifyRideOffer(value, distance, time, app)
        }

        source.recycle()
    }

    private fun parseUberRide(root: AccessibilityNodeInfo): Triple<Double, Double, Double>? {
        try {
            val allText = mutableListOf<String>()
            extractAllText(root, allText)
            
            var value = 0.0
            var distance = 0.0
            var time = 0.0

            for (text in allText) {
                val lower = text.lowercase()
                // Procurar valor (R$ XX,XX)
                val valueRegex = Regex("""R\$\s*(\d+[,.]?\d*)""")
                valueRegex.find(text)?.let {
                    value = it.groupValues[1].replace(",", ".").toDoubleOrNull() ?: 0.0
                }
                // Procurar distância (XX km)
                val distRegex = Regex("""(\d+[,.]?\d*)\s*km""", RegexOption.IGNORE_CASE)
                distRegex.find(text)?.let {
                    distance = it.groupValues[1].replace(",", ".").toDoubleOrNull() ?: 0.0
                }
                // Procurar tempo (XX min)
                val timeRegex = Regex("""(\d+)\s*min""", RegexOption.IGNORE_CASE)
                timeRegex.find(text)?.let {
                    time = it.groupValues[1].toDoubleOrNull() ?: 0.0
                }
            }

            if (value > 0 && distance > 0 && time > 0) {
                return Triple(value, distance, time)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return null
    }

    private fun parse99Ride(root: AccessibilityNodeInfo): Triple<Double, Double, Double>? {
        // Mesma lógica do Uber - os padrões de texto são similares
        return parseUberRide(root)
    }

    private fun extractAllText(node: AccessibilityNodeInfo, texts: MutableList<String>) {
        node.text?.let { texts.add(it.toString()) }
        node.contentDescription?.let { texts.add(it.toString()) }
        for (i in 0 until node.childCount) {
            val child = node.getChild(i) ?: continue
            extractAllText(child, texts)
            child.recycle()
        }
    }

    override fun onInterrupt() {}
}
```

### 1.3 Configurar `AndroidManifest.xml`

Adicione dentro de `<application>`:

```xml
<!-- Permissões -->
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Accessibility Service -->
<service
    android:name=".ScreenReaderService"
    android:exported="false"
    android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE">
    <intent-filter>
        <action android:name="android.accessibilityservice.AccessibilityService" />
    </intent-filter>
    <meta-data
        android:name="android.accessibilityservice"
        android:resource="@xml/accessibility_service_config" />
</service>
```

### 1.4 Criar `accessibility_service_config.xml`

**Caminho:** `android/app/src/main/res/xml/accessibility_service_config.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowStateChanged|typeWindowContentChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagIncludeNotImportantViews"
    android:canRetrieveWindowContent="true"
    android:description="@string/accessibility_service_description"
    android:notificationTimeout="100"
    android:packageNames="com.ubercab.driver,com.nineninetaxi.driver,br.com.driver99" />
```

### 1.5 Registrar o Plugin na `MainActivity.kt`

```kotlin
package app.lovable.ab4d3549aaf94cc191d476f3ac733589

import android.os.Bundle
import com.getcapacitor.BridgeActivity

class MainActivity : BridgeActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        registerPlugin(DriverProPlugin::class.java)
        super.onCreate(savedInstanceState)
    }
}
```

### 1.6 Adicionar Strings

**Caminho:** `android/app/src/main/res/values/strings.xml`

```xml
<string name="accessibility_service_description">
    DriverPro precisa desta permissão para ler as informações de corrida dos apps Uber e 99 
    e avaliar automaticamente se a corrida é boa para você aceitar.
</string>
```

## Passo 2: Build e Teste

```bash
# Instalar dependências
npm install

# Build do projeto web
npm run build

# Sincronizar com Android
npx cap sync android

# Rodar no emulador/dispositivo
npx cap run android
```

## Passo 3: Ativar Acessibilidade no Dispositivo

1. Abra o app DriverPro
2. Vá em **Config** → **Acessibilidade** → será redirecionado para as configurações do Android
3. Encontre **DriverPro** na lista de serviços de acessibilidade
4. Ative o serviço
5. Volte para o app e ative o monitoramento

## Notas Importantes

- A leitura de tela depende da estrutura visual dos apps Uber/99. Se eles mudarem o layout, os regex de parsing precisarão ser atualizados.
- O serviço de acessibilidade consome bateria. É recomendável solicitar a isenção de otimização de bateria.
- Alguns fabricantes (Xiaomi, Huawei, Samsung) têm gerenciadores de bateria agressivos. Instrua o usuário a desativar essas otimizações manualmente.
