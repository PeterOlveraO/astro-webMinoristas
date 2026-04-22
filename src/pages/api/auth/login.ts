import type { APIRoute } from 'astro';
// Importamos nuestro puente hacia C#
import { ApiService } from '../../../services/api';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { correo, password } = body;

    if (!correo || !password) {
      return new Response(JSON.stringify({ error: 'Correo y contraseña son requeridos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Pedimos los clientes a nuestro backend en C#
    const clientes = await ApiService.getClientes();
    
    // 2. Buscamos si existe el correo
    const cliente = clientes.find((c: any) => c.correo_contacto === correo);

    if (!cliente) {
      return new Response(JSON.stringify({ error: 'Credenciales inválidas. Verifica tu correo.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Set session cookies
    cookies.set('id_cliente', cliente.id_cliente, {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax'
    });
    cookies.set('nombre_empresa', cliente.nombre_empresa, {
      path: '/',
      httpOnly: false,
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax'
    });

    return new Response(JSON.stringify({
      success: true,
      cliente: {
        id_cliente: cliente.id_cliente,
        nombre_empresa: cliente.nombre_empresa,
        correo_contacto: cliente.correo_contacto
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error del servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};