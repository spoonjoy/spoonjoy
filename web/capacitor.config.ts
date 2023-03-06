import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.spoonjoy',
  appName: 'spoonjoy',
  webDir: 'dist',
  bundledWebRuntime: false,

  ios: {
    path: '../ios',
  },

  server: {
    iosScheme: 'spoonjoy',
  },
}

if (process.env.NODE_ENV !== 'development') {
  config.server = {
    url: process.env.CAPACITOR_LIVERELOAD_URL,
    cleartext: true,
  }
}

export default config
