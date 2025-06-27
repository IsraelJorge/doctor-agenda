# Doctor Agenda 🩺

## Introdução 👋

O Doctor Agenda é uma aplicação web moderna para gestão de clínicas, médicos, pacientes e agendamentos. O sistema foi desenvolvido para facilitar o controle de consultas, profissionais e pacientes, oferecendo uma interface intuitiva, responsiva e segura.

## Instalação 🚀

Siga os passos abaixo para rodar o projeto localmente:

1. 📥 Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   cd doctor-agenda
   ```
2. 📦 Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   # ou
   bun install
   ```
3. ⚙️ Configure as variáveis de ambiente conforme o arquivo `.env.example`.
4. 🗄️ Execute as migrations do banco de dados (PostgreSQL):
   ```bash
   npm run db:migrate
   ```
5. ▶️ Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   # ou
   bun dev
   ```
6. 🌐 Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## Tecnologias Utilizadas 🛠️

- ⚡ **Next.js 15 (App Router)**
- 🟦 **TypeScript**
- 🎨 **Tailwind CSS**
- 🧩 **shadcn/ui** (componentes de UI)
- 📝 **React Hook Form** (formulários)
- ✅ **Zod** (validação)
- 🔐 **BetterAuth** (autenticação)
- 🗃️ **PostgreSQL** (banco de dados)
- 🌱 **Drizzle ORM** (acesso a dados)

## Estrutura do Projeto 🗂️

```
src/
├── actions/         # Server Actions organizadas por domínio
├── app/             # Páginas, rotas e layouts (App Router)
│   └── (authenticated)/
│       ├── doctor/      # Gestão de médicos
│       ├── patient/     # Gestão de pacientes
│       ├── appointment/ # Agendamento de consultas
│       ├── dashboard/   # Painel de indicadores
│       └── ...
├── components/
│   └── ui/          # Componentes de UI reutilizáveis (shadcn/ui)
├── database/        # Configuração e acesso ao banco de dados (Drizzle)
├── helpers/         # Funções utilitárias (ex: manipulação de datas)
├── providers/       # Providers globais (ex: tema, autenticação)
├── services/        # Serviços externos e integrações
├── styles/          # Estilos globais
├── utils/           # Utilitários diversos
└── ...
```

## Conclusão 💡

O Doctor Agenda foi desenvolvido seguindo as melhores práticas de desenvolvimento web moderno, priorizando código limpo, reutilizável e seguro. Sinta-se à vontade para contribuir, sugerir melhorias ou relatar problemas!
