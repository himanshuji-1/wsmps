import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ correct ESM export
export default defineConfig({
  plugins: [react()],
})
