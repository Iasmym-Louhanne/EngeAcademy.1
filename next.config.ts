import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Otimizações para Vercel
  output: "standalone",

  // Configurações de imagem otimizadas
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        port: "",
        pathname: "/storage/v1/object/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Configurações experimentais estáveis
  experimental: {
    typedRoutes: false, // Desabilitado para evitar conflitos
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },

  // Configurações de webpack para resolver problemas comuns
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    // Resolver problemas com módulos Node.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Otimizações de bundle
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        chunks: "all",
      },
    };

    return config;
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },

  // ESLint configuração para não quebrar build
  eslint: {
    ignoreDuringBuilds: false, // Manter linting ativo para qualidade
  },

  // TypeScript configuração
  typescript: {
    ignoreBuildErrors: false, // Não ignorar erros TS
  },

  // Configurações de compilação
  swcMinify: true,

  // Configurações de ambiente
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
