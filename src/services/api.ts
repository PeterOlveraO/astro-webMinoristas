// src/services/api.ts
// Usamos la URL de tu API en C# según tu documentación
export const API_URL = import.meta.env.PUBLIC_API_URL

export const ApiService = {
  // Obtenemos las solicitudes desde C#
  getSolicitudes: async () => {
    try {
      const res = await fetch(`${API_URL}/solicitudCotizacion`);
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (error) {
      console.error("Error conectando al backend de C#:", error);
      return [];
    }
  },

  // Obtenemos clientes para el Login
  getClientes: async () => {
    try {
      const res = await fetch(`${API_URL}/cliente`);
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (error) {
      console.error("Error conectando al backend de C#:", error);
      return [];
    }
  }
};