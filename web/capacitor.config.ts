import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.spoonjoy',
  appName: 'spoonjoy',
  webDir: 'dist',
  bundledWebRuntime: false,

  ios: {
    path: '../ios',
  },
}

export default config
