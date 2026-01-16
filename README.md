# TixConcert - Concert Ticketing Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2.0-yellow.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-blue.svg)](https://tailwindcss.com/)

TixConcert adalah platform pemesanan tiket konser dan event musik yang modern dan user-friendly. Dibangun dengan teknologi terdepan untuk memberikan pengalaman terbaik kepada pengguna dalam membeli tiket event musik favorit mereka.

## ✨ Fitur Utama

### 🎫 Pemesanan Tiket
- **Browse Events**: Jelajahi berbagai event musik dengan kategori yang beragam
- **Event Details**: Informasi lengkap event termasuk deskripsi, artis, lokasi, dan tanggal
- **Ticket Categories**: Berbagai kategori tiket (VIP, Festival, Tribune) dengan benefit berbeda
- **Real-time Stock**: Sistem stok tiket real-time dengan validasi otomatis

### 🛒 Sistem Keranjang Belanja
- **Add to Cart**: Tambahkan tiket ke keranjang dengan mudah
- **Quantity Management**: Atur jumlah tiket dengan increment/decrement
- **Cart Persistence**: Keranjang tersimpan di localStorage
- **Price Calculation**: Perhitungan harga otomatis dengan service fee

### 👤 Sistem Autentikasi
- **User Registration**: Pendaftaran akun dengan validasi lengkap
- **Login/Logout**: Sistem login yang aman dengan token-based authentication
- **Profile Management**: Kelola informasi profil pengguna
- **Protected Routes**: Route protection untuk halaman yang memerlukan autentikasi

### 💳 Sistem Pembayaran
- **Multiple Payment Methods**: Credit Card, E-Wallet, Bank Transfer
- **Payment Simulation**: Simulasi pembayaran untuk demo purposes
- **Order Tracking**: Tracking status pesanan real-time
- **E-Ticket Generation**: Generate QR code untuk e-ticket

### 📊 Dashboard Pengguna
- **Order History**: Riwayat pesanan lengkap
- **Order Details**: Detail lengkap setiap pesanan
- **E-Ticket Display**: Tampilan e-ticket dengan QR code
- **Statistics**: Statistik pembelian (total orders, tickets, spent)

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern React dengan hooks dan concurrent features
- **TypeScript** - Type safety untuk development yang lebih robust
- **Vite** - Build tool yang cepat dan modern

### UI/UX
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Beautiful icons

### State Management
- **Zustand** - Lightweight state management dengan persistence
- **React Router** - Client-side routing

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Struktur Project

```
tixconcert-frontend/
├── public/                    # Static assets
│   ├── images/               # Event images
│   └── favicon.ico
├── src/
│   ├── assets/               # Imported assets
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── EventCard.tsx    # Event display card
│   │   ├── TicketSelector.tsx # Ticket selection component
│   │   ├── CartItem.tsx     # Cart item component
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Footer.tsx       # Site footer
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Landing page
│   │   ├── EventList.tsx    # Events listing page
│   │   ├── EventDetail.tsx  # Event detail page
│   │   ├── Cart.tsx         # Shopping cart page
│   │   ├── Checkout.tsx     # Checkout process
│   │   ├── Payment.tsx      # Payment processing
│   │   ├── PaymentSuccess.tsx # Payment success page
│   │   ├── Login.tsx        # Login page
│   │   ├── Register.tsx     # Registration page
│   │   ├── Dashboard.tsx    # User dashboard
│   │   ├── Orders.tsx       # Order history
│   │   ├── OrderDetail.tsx  # Order detail
│   │   └── Profile.tsx      # User profile
│   ├── stores/              # Zustand stores
│   │   ├── authStore.ts     # Authentication state
│   │   ├── cartStore.ts     # Shopping cart state
│   │   └── orderStore.ts    # Order management state
│   ├── hooks/               # Custom React hooks
│   │   ├── use-toast.ts     # Toast notifications
│   │   ├── use-mobile.tsx   # Mobile detection
│   │   └── useLocalStorage.ts # Local storage hook
│   ├── layouts/             # Layout components
│   │   └── MainLayout.tsx   # Main app layout
│   ├── utils/               # Utility functions
│   │   ├── api.ts           # API functions (mock)
│   │   └── formatters.ts    # Data formatters
│   ├── data/                # Static data
│   │   └── events.json      # Event data
│   ├── lib/                 # Library configurations
│   │   └── utils.ts         # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind configuration
├── components.json          # shadcn/ui configuration
└── README.md               # Project documentation
```

## 🚀 Instalasi dan Setup

### Prerequisites
- Node.js (versi 18 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone https://github.com/your-username/tixconcert-frontend.git
   cd tixconcert-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # atau
   yarn install
   ```

3. **Setup environment variables** (jika diperlukan)
   ```bash
   cp .env.example .env
   # Edit .env file dengan konfigurasi yang sesuai
   ```

4. **Run development server**
   ```bash
   npm run dev
   # atau
   yarn dev
   ```

5. **Buka browser**
   ```
   http://localhost:5173
   ```

### Build untuk Production

```bash
npm run build
# atau
yarn build
```

### Preview Production Build

```bash
npm run preview
# atau
yarn preview
```

## 📖 Penggunaan

### User Flow

1. **Landing Page**: Pengguna melihat event featured dan navigasi utama
2. **Browse Events**: Jelajahi semua event yang tersedia dengan filter dan search
3. **Event Details**: Lihat detail event dan pilih kategori tiket
4. **Add to Cart**: Tambahkan tiket ke keranjang belanja
5. **Checkout**: Proses checkout dengan informasi pembayaran
6. **Payment**: Simulasi pembayaran (untuk demo)
7. **Success**: Konfirmasi pembayaran dan e-ticket

### Authentication

- **Register**: Buat akun baru dengan email dan password
- **Login**: Masuk ke akun yang sudah ada
- **Dashboard**: Akses dashboard untuk melihat pesanan dan profil

### Cart Management

- Tambahkan item ke cart dari event detail page
- Update quantity atau remove item dari cart
- Cart tersimpan secara otomatis di localStorage

### Order Management

- Lihat semua order history di dashboard
- Detail order dengan QR code e-ticket
- Status tracking untuk setiap order

## 🔧 API Documentation

### Events API

#### Get All Events
```typescript
GET /api/events
// Returns: Event[]
```

#### Get Event by ID
```typescript
GET /api/events/:id
// Returns: Event | null
```

#### Search Events
```typescript
GET /api/events/search?q=:query
// Returns: Event[]
```

### Authentication API

#### Login
```typescript
POST /api/auth/login
{
  email: string,
  password: string
}
// Returns: { success: boolean, token?: string, error?: string }
```

#### Register
```typescript
POST /api/auth/register
{
  name: string,
  email: string,
  password: string,
  phone?: string
}
// Returns: { success: boolean, token?: string, error?: string }
```

### Orders API

#### Create Order
```typescript
POST /api/orders
{
  userId: string,
  items: CartItem[],
  totalAmount: number,
  paymentMethod: string
}
// Returns: Order
```

#### Get User Orders
```typescript
GET /api/orders/user/:userId
// Returns: Order[]
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#A855F7 to #EC4899)
- **Secondary**: Blue (#3B82F6)
- **Accent**: Orange (#F97316)
- **Background**: Dark theme dengan card-based design

### Typography
- **Font Family**: System fonts (Inter, sans-serif)
- **Headings**: Bold weights untuk hierarchy
- **Body**: Regular weight dengan good readability

### Components
- **shadcn/ui**: Consistent component library
- **Responsive**: Mobile-first design approach
- **Accessible**: WCAG compliant components

## 🧪 Testing

### Running Tests
```bash
npm run test
# atau
yarn test
```

### Test Coverage
```bash
npm run test:coverage
# atau
yarn test:coverage
```

## 📦 Deployment

### Build Commands
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment Platforms
- **Vercel**: Recommended untuk React apps
- **Netlify**: Alternative dengan good CI/CD
- **GitHub Pages**: Untuk static hosting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint configuration
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful UI components
- **Tailwind CSS** for utility-first styling
- **Lucide** for consistent iconography
- **React Community** for amazing ecosystem

## 📞 Support

For support, email support@tixconcert.com or join our Discord community.

---

**Made with ❤️ for music lovers everywhere**