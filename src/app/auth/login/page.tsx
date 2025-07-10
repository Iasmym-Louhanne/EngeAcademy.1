"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/integrations/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';

export default function LoginPage() {
  const supabase = createClient();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold">Bem-vindo de volta!</h1>
          <p className="text-muted-foreground">Faça login ou crie sua conta para continuar</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Endereço de e-mail',
                password_label: 'Sua senha',
                button_label: 'Entrar',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre',
              },
              sign_up: {
                email_label: 'Endereço de e-mail',
                password_label: 'Crie uma senha',
                button_label: 'Registrar',
                social_provider_text: 'Registrar com {{provider}}',
                link_text: 'Não tem uma conta? Registre-se',
              },
              forgotten_password: {
                email_label: 'Endereço de e-mail',
                password_label: 'Sua senha',
                button_label: 'Enviar instruções',
                link_text: 'Esqueceu sua senha?',
              },
            },
          }}
        />
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-primary hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}