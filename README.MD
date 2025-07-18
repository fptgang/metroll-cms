# Metroll CMS - Metro Ticketing Content Management System

<div align="center" style="margin: 30px;">
    <a href="https://refine.dev">
    <img alt="refine logo" src="https://refine.ams3.cdn.digitaloceanspaces.com/readme/refine-readme-banner.png">
    </a>
</div>
<br/>

A React-based Content Management System for managing Metro Ticketing System built with [Refine](https://github.com/refinedev/refine), Ant Design, Firebase, and TypeScript.

## Features

- **Authentication**: Firebase Authentication integration with backend JWT
- **Account Management**: Full CRUD operations for user accounts (Admin, Staff, Customer)
- **Ticket Management**: Comprehensive ticket management system
- **Dashboard**: Real-time statistics and overview
- **Responsive Design**: Modern UI with Ant Design components
- **TypeScript**: Full type safety throughout the application
- **State Management**: React Query for efficient data fetching

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **UI Framework**: Ant Design
- **State Management**: React Query (@tanstack/react-query)
- **Authentication**: Firebase Auth
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS + Ant Design
- **TypeScript**: Full type support
- **Admin Framework**: Refine.dev

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version 18 or higher)
- npm or yarn
- Firebase project setup
- Metroll backend services running

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd metroll/metroll-cms
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure Firebase**
   Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_API_URL=http://localhost:8080
```

4. **Start the development server**

```bash
npm run dev
```

## Backend Integration

This CMS integrates with the Metroll backend services through the API Gateway at `http://localhost:8080`. Ensure the following services are running:

- **Config Server** (port 8888)
- **Service Registry** (Eureka)
- **API Gateway** (port 8080)
- **Account Service**
- **Ticket Service**

## Authentication Flow

1. User enters credentials in the login form
2. Firebase Authentication validates the credentials
3. Firebase ID token is sent to the backend `/account/login/` endpoint
4. Backend validates the Firebase token and returns user data with JWT
5. JWT token is stored and used for subsequent API calls

## Available Pages

### Dashboard

- Overview statistics
- Account and ticket summaries
- Quick navigation

### Account Management

- **List**: View all accounts with search and filtering
- **Create**: Add new accounts (Admin, Staff, Customer)
- **Edit**: Update account information and status
- **Show**: View detailed account information

### Ticket Management

- **List**: View all tickets with status tracking
- **Show**: View detailed ticket information
- **Status Management**: Update ticket status

## API Endpoints

The CMS integrates with the following backend endpoints:

### Account Service (`/account`)

- `GET /account` - List accounts
- `POST /account` - Create account
- `GET /account/{id}` - Get account by ID
- `PUT /account/{id}` - Update account
- `DELETE /account/{id}` - Deactivate account
- `POST /account/login/` - Authentication

### Ticket Service (`/ticket`)

- `GET /ticket` - List tickets
- `POST /ticket` - Create ticket
- `GET /ticket/{id}` - Get ticket by ID
- `PUT /ticket/{id}/status` - Update ticket status

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
│   ├── accounts/      # Account management pages
│   ├── tickets/       # Ticket management pages
│   └── dashboard/     # Dashboard page
├── providers/         # Data and auth providers
├── utils/            # Utility functions
└── App.tsx           # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License

## Support

For support and questions, please contact the development team or create an issue in the repository.
#   m e t r o l l - c m s  
 "# metroll-cms" 
#   m e t r o l l - c m s  
 