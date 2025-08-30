# Library Management System - Frontend

A modern, responsive web application for managing library operations with separate interfaces for administrators (librarians) and users (borrowers). Built with React, Vite, and React Router.

## Features

### User Features
- **Dashboard**: Overview of borrowed books and due dates
- **Browse Books**: Search and view available books
- **Book Returns**: Manage book returns and view history
- **Profile**: View and update personal information

### Admin Features
- **Dashboard**: Library statistics and quick actions
- **Users Management**: Manage library users (add, edit, delete)
- **Books Management**: Manage book inventory (add, edit, delete)
- **Borrowed Books**: Track all borrowed books and due dates

## Tech Stack

- **Frontend**: React 18
- **Routing**: React Router v6
- **State Management**: React Context API
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React Icons
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify
- **Build Tool**: Vite

## Project Structure

```
src/
├── assets/            # Static assets (images, etc.)
├── components/        # Reusable UI components
├── config/            # Configuration files
├── Login-SignUp/      # Authentication components
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Unauthorized.jsx
├── pages/             # Page components
│   ├── Page-Admin/    # Admin interface pages
│   │   ├── BooksManagement.jsx
│   │   ├── BorrowedBooks.jsx
│   │   ├── LibraryDashboard.jsx
│   │   ├── UsersManagement.jsx
│   │   └── ...
│   └── Page-User/     # User interface pages
│       ├── BookDetailCard.jsx
│       ├── BookReturns.jsx
│       ├── BrowseBooks.jsx
│       ├── Dashboard.jsx
│       ├── Profile.jsx
│       └── UserDashboard.jsx
├── protected/         # Protected route components
└── App.jsx            # Main application component
```

## Routing

The application uses protected routes based on user roles:

### Public Routes
- `/` - Home/Landing page
- `/login` - User/Admin login
- `/register` - New user registration
- `/unauthorized` - Access denied page

### Protected User Routes (`/user/*`)
- `/user/dashboard` - User dashboard
- `/user/browse` - Browse available books
- `/user/returns` - View return history
- `/user/profile` - User profile

### Protected Admin Routes (`/admin/*`)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - Manage users
- `/admin/books` - Manage books
- `/admin/borrowed` - View borrowed books

## Authentication Flow

1. **Login**: Users can log in as either a borrower or librarian
2. **Role-based Access**: 
   - Regular users are redirected to `/user/dashboard`
   - Admin users are redirected to `/admin/dashboard`
3. **Protected Routes**: Unauthorized access attempts redirect to `/unauthorized`
4. **Session Management**: JWT tokens stored in localStorage for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```
   VITE_API_BASE_URL=your_api_url_here
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_BASE_URL=your_api_base_url
```

## Dependencies

- react: ^18.2.0
- react-dom: ^18.2.0
- react-router-dom: ^6.14.2
- axios: ^1.4.0
- react-toastify: ^9.1.3
- lucide-react: ^0.263.1
- @tailwindcss/forms: ^0.5.3
- autoprefixer: ^10.4.15
- postcss: ^8.4.27
- tailwindcss: ^3.3.3
- vite: ^4.4.5

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
