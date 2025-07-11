import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestData = await req.json()
    const { email, full_name, profile_id, accessible_branches, has_full_access } = requestData

    // Validate required fields
    if (!email || !full_name || !profile_id) {
      return new Response(
        JSON.stringify({ error: 'Email, nome e perfil são obrigatórios.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Invite user via Supabase Auth
    const { data: authUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          full_name: full_name,
        }
      }
    )

    if (inviteError) {
      console.error('Invite error:', inviteError)
      
      if (inviteError.message.includes('User already registered')) {
        return new Response(
          JSON.stringify({ error: 'Este email já está cadastrado no sistema.' }),
          {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
      
      return new Response(
        JSON.stringify({ error: inviteError.message }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Insert user into internal_users table
    const { error: dbError } = await supabaseAdmin
      .from('internal_users')
      .insert({
        id: authUser.user.id,
        email: email,
        full_name: full_name,
        profile_id: profile_id,
        accessible_branches: accessible_branches || [],
        has_full_access: has_full_access || false,
        is_active: true,
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar dados do usuário.' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Convite enviado com sucesso!' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})