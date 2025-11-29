# TixConcert

A modern concert ticketing web application built with React, TypeScript, and Tailwind CSS. This app allows users to browse upcoming concerts, purchase tickets, manage their orders, and enjoy a seamless ticketing experience.

## Features

- 🎫 Browse and search for concerts
- 🛒 Add tickets to cart and checkout
- 👤 User authentication and profiles
- 📱 Responsive design for mobile and desktop
- 💳 Secure payment processing
- 📊 Order history and management
- 🎨 Modern UI with shadcn/ui components

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tix-concert
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:8080`.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── stores/        # Zustand state stores
├── utils/         # Utility functions
├── layouts/       # Layout components
├── lib/           # Library configurations
├── data/          # Static data files
└── assets/        # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
