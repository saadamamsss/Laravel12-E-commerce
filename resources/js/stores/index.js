import { createPinia } from 'pinia'
// Initialize Pinia
export const pinia = createPinia();
// Export function to initialize Pinia with a Vue app
export function setupPinia(app) {
  app.use(pinia)
}
