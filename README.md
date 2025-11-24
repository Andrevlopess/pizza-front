# 🍕 Pizzaria Popovici - Frontend

Sistema completo de gerenciamento de pizzaria com interface administrativa e página de pedidos para clientes, desenvolvido com React, TypeScript e Tailwind CSS.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Rotas](#rotas)
- [Componentes Principais](#componentes-principais)
- [Autenticação](#autenticação)
- [Fluxo de Pedidos](#fluxo-de-pedidos)
- [API Integration](#api-integration)

## 🎯 Sobre o Projeto

O **Pizzaria Popovici Frontend** é uma aplicação web moderna que oferece duas interfaces principais:

1. **Painel Administrativo**: Gerenciamento completo de produtos, clientes, pedidos e visualização de estatísticas
2. **Página do Cliente**: Interface pública para navegação no cardápio e realização de pedidos

O projeto foi desenvolvido com foco em usabilidade, performance e experiência do usuário, utilizando as tecnologias mais modernas do ecossistema React.

## ✨ Funcionalidades

### Painel Administrativo (Protegido)

- **Dashboard**
  - Visualização de estatísticas em tempo real (total de clientes, produtos e pedidos)
  - Filtros por período (data inicial e final)
  - Navegação rápida para seções específicas
  - Contadores com links diretos

- **Gerenciamento de Produtos**
  - Listagem completa de itens do cardápio
  - Criação, edição e exclusão de produtos
  - Campos: nome, descrição e preço
  - Mensagem quando não há produtos cadastrados

- **Gerenciamento de Clientes**
  - Listagem de todos os clientes cadastrados
  - Criação, edição e exclusão de clientes
  - Campos completos: nome, email, telefone, endereço completo
  - Mensagem quando não há clientes cadastrados

- **Gerenciamento de Pedidos**
  - Listagem de todos os pedidos realizados
  - Visualização detalhada de cada pedido
  - Informações: cliente, itens, quantidades, método de pagamento
  - Mensagem quando não há pedidos

- **Autenticação**
  - Sistema de login com email e senha
  - Proteção de rotas administrativas
  - Persistência de sessão
  - Logout em múltiplos locais (header e sidebar)

### Página do Cliente (Pública)

- **Cardápio Interativo**
  - Grid responsivo com todos os produtos disponíveis
  - Cards com nome, descrição e preço
  - Botão de adicionar ao carrinho

- **Carrinho Lateral Permanente**
  - Sempre visível no lado direito da tela
  - Contador de itens no topo
  - Ajuste de quantidade (+ / -)
  - Remoção de itens
  - Cálculo automático do total
  - Seleção de método de pagamento

- **Checkout Inteligente**
  - Solicitação de email do cliente
  - Verificação automática no banco de dados
  - **Se cliente existe**: Exibe dados cadastrados e confirma pedido
  - **Se cliente novo**: Solicita endereço completo e cria cadastro
  - Feedback visual em cada etapa
  - Mensagem de sucesso após finalização

## 🚀 Tecnologias Utilizadas

### Core
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Superset JavaScript com tipagem estática
- **Vite** - Build tool e dev server ultra-rápido

### Estilização
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Componentes de UI reutilizáveis e acessíveis
- **Lucide React** - Biblioteca de ícones

### Roteamento e Estado
- **React Router v6** - Roteamento client-side
- **React Context API** - Gerenciamento de estado global (autenticação)
- **React Hooks** - useState, useEffect, useNavigate, etc.

### Componentes UI (shadcn/ui)
- Button, Card, Dialog, Input, Label
- Select, Table, Sidebar, Sheet
- Combobox, Command, Popover
- Separator, Skeleton, Tooltip, Textarea

### HTTP Client
- **Fetch API** - Requisições HTTP nativas
- **Services Layer** - Camada de abstração para API calls

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Backend da Pizzaria** rodando em `http://localhost:3000`

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Andrevlopess/pizza-front.git
cd pizza-app
```

2. Instale as dependências:
```bash
npm install
```

## ⚙️ Configuração

### Variáveis de Ambiente

O projeto está configurado para se conectar ao backend em `http://localhost:3000/api`. Se necessário, ajuste a URL base nos arquivos de serviço em `src/services/`.

### Backend

Certifique-se de que o backend está rodando e acessível. O frontend espera os seguintes endpoints:

- `GET /api/items` - Listar produtos
- `GET /api/users` - Listar clientes
- `GET /api/users/email/:email` - Buscar cliente por email
- `GET /api/orders` - Listar pedidos
- `GET /api/payment-methods` - Listar métodos de pagamento
- `GET /api/dashboard/stats` - Estatísticas (com query params `?startDate=&endDate=`)
- `POST /api/items` - Criar produto
- `POST /api/users` - Criar cliente
- `POST /api/orders` - Criar pedido
- `PUT /api/items/:id` - Atualizar produto
- `PUT /api/users/:id` - Atualizar cliente
- `DELETE /api/items/:id` - Deletar produto
- `DELETE /api/users/:id` - Deletar cliente
- `DELETE /api/orders/:id` - Deletar pedido

## 🎮 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O projeto será aberto automaticamente em `http://localhost:5173` (ou outra porta se 5173 estiver em uso).

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
pizza-app/
├── public/              # Arquivos estáticos
│   └── _redirects      # Configuração de redirecionamento (Netlify)
├── src/
│   ├── assets/         # Imagens, fontes, etc.
│   ├── components/     # Componentes React
│   │   ├── ui/         # Componentes shadcn/ui
│   │   ├── form/       # Componentes de formulário
│   │   ├── app-sidebar.tsx
│   │   ├── counter-card.tsx
│   │   ├── header.tsx
│   │   ├── layout.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/       # Contextos React
│   │   └── AuthContext.tsx
│   ├── hooks/          # Custom hooks
│   │   └── use-mobile.ts
│   ├── lib/            # Utilitários
│   │   ├── api-client.ts
│   │   └── utils.ts
│   ├── pages/          # Páginas da aplicação
│   │   ├── dashboard.tsx
│   │   ├── clients.tsx
│   │   ├── products.tsx
│   │   ├── orders.tsx
│   │   ├── login.tsx
│   │   └── customer-order.tsx
│   ├── services/       # Camada de serviços API
│   │   ├── api.ts
│   │   ├── dashboardService.ts
│   │   ├── itemService.ts
│   │   ├── itemSizeService.ts
│   │   ├── orderService.ts
│   │   ├── paymentMethodService.ts
│   │   └── userService.ts
│   ├── types/          # Definições TypeScript
│   │   └── index.ts
│   ├── App.tsx         # Componente raiz
│   ├── App.css         # Estilos globais
│   ├── main.tsx        # Ponto de entrada
│   └── index.css       # Estilos Tailwind
├── components.json     # Configuração shadcn/ui
├── docker-compose.yaml # Docker Compose
├── package.json        # Dependências e scripts
├── tsconfig.json       # Configuração TypeScript
├── vite.config.ts      # Configuração Vite
└── tailwind.config.js  # Configuração Tailwind
```

## 🛣️ Rotas

### Rotas Públicas
- `/login` - Página de autenticação
- `/customer` - Página de pedidos para clientes

### Rotas Protegidas (Requer autenticação)
- `/` - Dashboard principal
- `/products` - Gerenciamento de produtos
- `/clients` - Gerenciamento de clientes
- `/orders` - Gerenciamento de pedidos

## 🧩 Componentes Principais

### Layout Components

**Layout** (`src/components/layout.tsx`)
- Container principal da aplicação administrativa
- Integra Sidebar e Header
- Wrapper para conteúdo das páginas

**AppSidebar** (`src/components/app-sidebar.tsx`)
- Navegação lateral com ícones
- Links: Dashboard, Pedidos, Clientes, Produtos
- Botão de logout no rodapé

**Header** (`src/components/header.tsx`)
- Cabeçalho com breadcrumb
- Exibição do email do usuário logado
- Botão de logout

### Functional Components

**ProtectedRoute** (`src/components/ProtectedRoute.tsx`)
- HOC para proteção de rotas
- Verifica autenticação via AuthContext
- Redireciona para /login se não autenticado
- Exibe loading durante verificação

**CounterCard** (`src/components/counter-card.tsx`)
- Card de estatística do dashboard
- Props: title, value, icon, link
- Botão "Ver mais" com navegação

### Form Components

**OrdersForm** (`src/components/form/orders-form.tsx`)
- Formulário de criação/edição de pedidos
- Seleção de cliente
- Seleção de itens e quantidades
- Seleção de método de pagamento

## 🔐 Autenticação

### AuthContext

Localizado em `src/contexts/AuthContext.tsx`, gerencia:

- `isAuthenticated`: Estado de autenticação
- `isLoading`: Carregamento inicial
- `userEmail`: Email do usuário logado
- `login(email, password)`: Função de login
- `logout()`: Função de logout

### Credenciais de Acesso

**Mock Authentication** (para desenvolvimento):
- Email: Qualquer email válido
- Senha: `admin123`

### Fluxo de Autenticação

1. Usuário acessa `/login`
2. Insere email e senha "admin123"
3. Sistema valida e armazena em `localStorage`
4. Redireciona para dashboard `/`
5. `ProtectedRoute` verifica autenticação em cada navegação
6. Logout limpa `localStorage` e redireciona para `/login`

### Persistência de Sessão

```javascript
// Armazenado no localStorage
{
  "auth_token": "authenticated",
  "auth_email": "usuario@email.com"
}
```

## 🛒 Fluxo de Pedidos

### Página do Cliente

1. **Navegação no Cardápio**
   - Cliente visualiza produtos disponíveis
   - Adiciona itens ao carrinho lateral

2. **Carrinho**
   - Ajusta quantidades
   - Seleciona método de pagamento
   - Clica em "Finalizar Pedido"

3. **Checkout - Etapa 1: Email**
   - Modal solicita email
   - Sistema verifica no backend via `GET /api/users/email/:email`

4. **Checkout - Etapa 2A: Cliente Existente**
   - Exibe dados cadastrados (nome, endereço, telefone)
   - Botão "Confirmar e Finalizar Pedido"
   - Cria pedido e limpa carrinho

5. **Checkout - Etapa 2B: Cliente Novo**
   - Formulário completo de cadastro
   - Campos: nome, telefone, CEP, rua, número, bairro, cidade, estado, complemento
   - Email pré-preenchido e desabilitado
   - Cria cliente via `POST /api/users`
   - Cria pedido automaticamente
   - Limpa carrinho

6. **Confirmação**
   - Mensagem de sucesso verde no topo
   - "✓ Pedido realizado com sucesso! Obrigado pela preferência!"
   - Desaparece após 5 segundos

## 🔌 API Integration

### Services Layer

Todos os serviços seguem o padrão CRUD:

**itemService.ts**
```typescript
getAll(): Promise<IItem[]>
getById(id: number): Promise<IItem>
create(data: Omit<IItem, 'id'>): Promise<IItem>
update(id: number, data: Omit<IItem, 'id'>): Promise<IItem>
delete(id: number): Promise<void>
```

**userService.ts**
```typescript
getAll(): Promise<IUser[]>
getById(id: number): Promise<IUser>
create(data: Omit<IUser, 'id'>): Promise<IUser>
update(id: number, data: Omit<IUser, 'id'>): Promise<IUser>
delete(id: number): Promise<void>
```

**orderService.ts**
```typescript
getAll(): Promise<IOrder[]>
getById(id: number): Promise<IOrder>
create(data): Promise<IOrder>
delete(id: number): Promise<void>
```

**dashboardService.ts**
```typescript
getStats(startDate?: string, endDate?: string): Promise<IDashboardStats>
```

**paymentMethodService.ts**
```typescript
getAll(): Promise<IPaymentMethod[]>
```

### Tipos TypeScript

Localizados em `src/types/index.ts`:

```typescript
interface IItem {
  id?: number;
  name: string;
  description: string;
  price_in_cents: number;
}

interface IUser {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  street: string;
  neighborhood: string;
  number: number;
}

interface IOrder {
  id?: number;
  user_id: number;
  payment_method_id: number;
  items: IOrderItem[];
  user?: IUser;
  payment_method?: IPaymentMethod;
}

interface IOrderItem {
  item_id: number;
  quantity: number;
  item?: IItem;
}

interface IPaymentMethod {
  id?: number;
  name: string;
}

interface IDashboardStats {
  totalClients: number;
  totalProducts: number;
  totalOrders: number;
}
```

## 🎨 Tema e Estilização

### Cores Principais
- **Primária (Orange)**: `#ea580c` - Botões, links, destaques
- **Sucesso (Green)**: `#10b981` - Mensagens de confirmação
- **Erro (Red)**: `#ef4444` - Mensagens de erro, botões de exclusão
- **Fundo**: Gradiente de `orange-50` para `white`

### Componentes Shadcn/ui

Todos os componentes seguem o design system configurado em `components.json`:

- Paleta de cores customizada
- Border radius de 0.5rem
- Variáveis CSS para temas
- Suporte a dark mode (preparado)

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints Tailwind:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Ajustes Responsivos

- Grid de produtos: 1 coluna (mobile) → 2 colunas (tablet) → 3 colunas (desktop)
- Sidebar: Colapsável em mobile
- Carrinho: Sempre visível, width fixo em 384px (desktop)
- Tabelas: Scroll horizontal em mobile

## 🐛 Tratamento de Erros

- Try/catch em todas as chamadas de API
- Alerts para feedback ao usuário
- Console.error para debugging
- Mensagens em português

## 🔄 Estado e Atualização

- Estado local com `useState`
- Re-fetch após operações CRUD
- Limpeza de formulários após sucesso
- Feedback visual durante loading

## 🚀 Deploy

### Build

```bash
npm run build
```

### Netlify

O arquivo `public/_redirects` está configurado para SPA:

```
/* /index.html 200
```

### Variáveis de Ambiente (Produção)

Ajuste a URL base da API nos arquivos de serviço para o endpoint de produção.

## 📄 Licença

Este projeto é parte de um trabalho acadêmico.

## 👨‍💻 Autor

André Lopes - [GitHub](https://github.com/Andrevlopess)

---

**Pizzaria Popovici** - Sistema completo de gerenciamento de pizzaria 🍕
