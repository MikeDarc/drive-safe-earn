## Plano de Implementação

### 1. Nova aba "Configurações" completa
- Mover valores ideais (R$/km, R$/hora, tempo máximo) do EarningsTab para SettingsTab
- Adicionar seções de permissões nativas (notificação, overlay, bateria, câmera, acessibilidade)
- Persistir configurações via localStorage

### 2. Simplificar aba "Monitoramento de Ganhos"  
- Manter apenas o botão de ativar/desativar monitoramento
- Mostrar status do monitoramento (ativo/inativo)
- Exibir popup de resultado quando corrida é detectada

### 3. Plugin Capacitor para Accessibility Service
- Criar estrutura do plugin nativo `capacitor-screen-reader`
- Código TypeScript de interface para comunicação JS ↔ nativo
- Instruções detalhadas para implementação do AccessibilityService em Kotlin
- Quando monitoramento ativo, o plugin lê dados do Uber/99 e dispara popup

### 4. Permissões nativas via Capacitor
- Notificações: usar `@capacitor/push-notifications` ou API nativa
- Overlay: intent para `Settings.ACTION_MANAGE_OVERLAY_PERMISSION`
- Otimização de bateria: intent para `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`
- Câmera: solicitar permissão via `@capacitor/camera`
- Acessibilidade: intent para configurações de acessibilidade

### 5. PWA compliance
- Service worker já configurado
- Manifest já completo
- Garantir responsividade mobile/tablet
