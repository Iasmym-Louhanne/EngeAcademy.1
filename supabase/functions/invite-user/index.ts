import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email, full_name, profile_id, accessible_branches, has_full_access } = await req.json();

    if (!email || !full_name || !profile_id) {
      return new Response(JSON.stringify({ error: 'Email, nome e perfil são obrigatórios.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Convidar o usuário para o sistema de autenticação
    const { data: authUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: full_name,
      }
    });

    if (inviteError) {
      // Tratar erro comum de usuário já existente
      if (inviteError.message.includes("User already registered")) {
        return new Response(JSON.stringify({ error: 'Este email já está cadastrado no sistema.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 409, // Conflict
        });
      }
      throw inviteError;
    }

    // Criar o registro na tabela de usuários internos
    const { error: dbError } = await supabaseAdmin
      .from('internal_users')
      .insert({
        id: authUser.user.id, // Usar o mesmo ID do usuário de autenticação
        email: email,
        full_name: full_name,
        profile_id: profile_id,
        accessible_branches: accessible_branches || [],
        has_full_access: has_full_access || false,
        is_active: true,
      });

    if (dbError) {
      // Se a inserção no banco falhar, idealmente deveríamos deletar o usuário convidado para evitar inconsistência.
      // await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw dbError;
    }

    return new Response(JSON.stringify({ message: 'Convite enviado com sucesso!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});