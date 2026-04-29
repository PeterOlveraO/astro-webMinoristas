import type { APIRoute } from 'astro';

const API_URL = import.meta.env.API_URL ?? 'http://localhost:5145';
const headers = { 'Content-Type': 'application/json' };

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const { correo, password } = body;

    if (!correo || !password) {
      return new Response(JSON.stringify({ error: 'Correo y contraseña son requeridos' }), {
        status: 400, headers
      });
    } // ✅ llave de cierre

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: correo, password })
    });

    const data = await res.json();
// ✅ TEMPORAL — agrega estas líneas para ver qué llega
console.log('[LOGIN MINORISTA] res.ok:', res.ok);
console.log('[LOGIN MINORISTA] data completo:', JSON.stringify(data, null, 2));

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.message ?? 'Credenciales inválidas' }), {
        status: res.status, headers
      });
    } // ✅ llave de cierre

    const { user_id, perfil } = data.data;

    if (!user_id) {
      return new Response(JSON.stringify({ error: 'No se pudo obtener el ID del cliente' }), {
        status: 500, headers
      });
    } // ✅ llave de cierre

    const cookieOptions = {
      path: '/', httpOnly: true, secure: false,
      maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' as const
    };

    cookies.set('id_cliente', user_id, cookieOptions);
    cookies.set('nombre_empresa', perfil?.nombre_empresa ?? '', {
      ...cookieOptions, httpOnly: false
    });

    return new Response(JSON.stringify({ success: true, data: { perfil } }), {
      status: 200, headers
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error del servidor' }), {
      status: 500, headers
    });
  }
};