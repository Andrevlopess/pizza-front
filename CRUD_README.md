# Pizza App - CRUD Implementation

## Overview
This frontend application provides CRUD (Create, Read, Update, Delete) functionality for a pizzeria management system. It connects to the backend API at `./pizza-app-back` and uses shadcn/ui as the UI library.

## Features Implemented

### 1. Clients Management (`/clients`)
- **List all clients**: View all registered clients in a table
- **Create client**: Add new clients with full address information
- **Edit client**: Update existing client details
- **Delete client**: Remove clients from the system

Client fields:
- Name, Email, Phone
- Address details: Street, Number, Neighborhood, City, State, ZIP Code

### 2. Products Management (`/products`)
- **List all products**: View all available products/items
- **Create product**: Add new products with pricing
- **Edit product**: Update product details and prices
- **Delete product**: Remove products from catalog

Product fields:
- Name, Description
- Size ID
- Price (in cents, displayed in BRL currency)

### 3. Orders Management (`/orders`)
- **List all orders**: View all orders with client and payment information
- **Create order**: Place new orders for clients
- **Edit order**: Update order details
- **Delete order**: Remove orders from the system

Order fields:
- Client selection (dropdown)
- Payment method (Credit Card, Debit Card, Cash, PIX)

## Technical Stack

- **Framework**: React 19 + TypeScript
- **Routing**: React Router DOM v7
- **UI Library**: shadcn/ui (Radix UI components)
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── textarea.tsx
│   │   └── ...
│   ├── app-sidebar.tsx      # Navigation sidebar
│   └── layout.tsx           # Main layout wrapper
├── pages/
│   ├── clients.tsx          # Clients CRUD page
│   ├── products.tsx         # Products CRUD page
│   ├── orders.tsx           # Orders CRUD page
│   └── dashboard.tsx        # Dashboard page
├── services/
│   ├── api.ts               # Base API client
│   ├── userService.ts       # Client/User API calls
│   ├── itemService.ts       # Product/Item API calls
│   └── orderService.ts      # Order API calls
├── types/
│   └── index.ts             # TypeScript interfaces
└── App.tsx                  # Main app with routes
```

## API Integration

The app connects to the backend API using the configuration in `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

### API Endpoints Used

- **Users/Clients**: `/api/users`
  - GET `/api/users` - List all
  - GET `/api/users/:id` - Get by ID
  - POST `/api/users` - Create
  - PUT `/api/users/:id` - Update
  - DELETE `/api/users/:id` - Delete

- **Items/Products**: `/api/items`
  - GET `/api/items` - List all
  - GET `/api/items/:id` - Get by ID
  - POST `/api/items` - Create
  - PUT `/api/items/:id` - Update
  - DELETE `/api/items/:id` - Delete

- **Orders**: `/api/orders`
  - GET `/api/orders` - List all
  - GET `/api/orders/:id` - Get by ID
  - POST `/api/orders` - Create
  - PUT `/api/orders/:id` - Update
  - DELETE `/api/orders/:id` - Delete

## Running the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## Navigation

The application includes a sidebar with the following menu items:

- **Início** (Home) - `/` - Dashboard
- **Pedidos** (Orders) - `/orders` - Orders management
- **Produtos** (Products) - `/products` - Products management
- **Clientes** (Clients) - `/clients` - Clients management

## Components Added

### shadcn/ui Components
- `table` - For displaying data in tables
- `select` - For dropdown selections
- `textarea` - For multi-line text input
- `dialog` - For modal forms

### Custom Components
- Service layer for API communication
- CRUD pages for each entity
- Form dialogs with validation

## Notes

- All forms include proper validation
- Delete operations require confirmation
- Prices are stored in cents and displayed in BRL currency
- The app uses TypeScript for type safety
- All API calls include error handling

## Future Enhancements

Potential improvements:
- Add pagination for large data sets
- Implement search and filtering
- Add order items management (products within an order)
- Include data export functionality
- Add user authentication
- Implement real-time updates
