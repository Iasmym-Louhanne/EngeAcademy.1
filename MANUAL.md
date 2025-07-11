# Manual do Aplicativo EngeAcademy

Este manual fornece uma visão geral da estrutura do projeto, explicando onde encontrar e como modificar diferentes partes do aplicativo.

## 1. Estrutura de Arquivos

O projeto segue a estrutura padrão do Next.js com o App Router. Os arquivos mais importantes estão dentro da pasta `src`.

- **`src/app`**: Contém todas as rotas e páginas do aplicativo. Cada pasta dentro de `src/app` corresponde a uma rota. Por exemplo, `src/app/cursos/page.tsx` é a página que renderiza a rota `/cursos`.
- **`src/components`**: Contém todos os componentes reutilizáveis da interface do usuário (UI), como botões, cards e formulários.
- **`src/lib`**: Contém a lógica de negócios, serviços e funções utilitárias.
- **`src/contexts`**: Contém os contextos React, como o `auth-context.tsx` para gerenciamento de autenticação.
- **`src/integrations`**: Contém a configuração de serviços de terceiros, como o Supabase.
- **`public`**: Contém arquivos estáticos, como imagens e fontes.

## 2. Como Fazer Alterações

### Alterações de Estilo (CSS)

Para alterar a aparência do site, você deve modificar principalmente os seguintes arquivos:

- **`src/globals.css`**: Este arquivo contém as variáveis de cores e estilos globais. Se você quiser alterar a cor primária do site, por exemplo, pode modificar as variáveis `--primary` aqui.
- **Componentes com `className`**: A maioria dos componentes usa Tailwind CSS para estilização. Você pode alterar as classes `className` diretamente nos arquivos de componentes em `src/components` para ajustar o layout e a aparência.

### Gerenciamento de Cursos

Toda a lógica relacionada a cursos está no arquivo:

- **`src/lib/course-service.ts`**: Este arquivo contém as funções para buscar, criar, atualizar e deletar cursos no Supabase. Se precisar alterar como os cursos são gerenciados, este é o lugar certo.

As páginas de gerenciamento de cursos no painel de administração estão em:

- **`src/app/dashboard/admin/cursos/`**: Contém as páginas para listar, criar e editar cursos.

### Gerenciamento de Autenticação

A lógica de autenticação e gerenciamento de sessão do usuário está centralizada no:

- **`src/contexts/auth-context.tsx`**: Este arquivo gerencia o estado do usuário (logado ou não), busca as permissões e redireciona o usuário após o login. Se precisar alterar o comportamento do login ou logout, comece por aqui.

### Dados de Exemplo (Mock Data)

Para facilitar o desenvolvimento, alguns dados são "mockados" (simulados). Eles estão no arquivo:

- **`src/lib/mock-data.ts`**: Contém dados de exemplo para cursos, funcionários, empresas, etc. Quando a integração com o backend estiver completa, esses dados podem ser substituídos por chamadas de API.

## 3. Principais Fluxos

- **Login**: O usuário insere suas credenciais em `/auth/login`. O `auth-context.tsx` detecta o login, busca o perfil do usuário e o redireciona para o dashboard correto (`/dashboard/admin`, `/dashboard/empresa` ou `/dashboard/aluno`).
- **Criação de Curso**: O administrador acessa `/dashboard/admin/cursos/novo`, preenche o formulário e, ao salvar, a função `createCourse` de `src/lib/course-service.ts` é chamada para criar o curso no Supabase.
- **Visualização de Curso (Aluno)**: O aluno acessa um curso em `/treinamento/[slug]`. A página busca os dados do curso e seus módulos/aulas para exibição.

Espero que este manual ajude nas futuras manutenções! Se tiver mais alguma dúvida, é só perguntar.