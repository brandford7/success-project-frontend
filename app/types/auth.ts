// This defines what a User object looks like
export interface User {
  id: string; // User's unique ID
  email: string | null; // User's email (can be null if they used phone)
  phoneNumber: string | null; // User's phone (can be null if they used email)
  roles: string[]; // Array of role names like ['user'] or ['admin']
  isVip: boolean; // Is the user a VIP subscriber?
  vipExpiresAt: string | null // When does VIP expire?
  createdAt: string; // When was the account created?
}

// This defines what we send when logging in
export interface LoginCredentials {
  identifier: string; // Can be email OR phone number
  password: string; // User's password
}

// This defines what we send when registering
export interface RegisterCredentials {
  email?: string; // Email (optional, but need email OR phone)
  phoneNumber?: string; // Phone (optional, but need email OR phone)
  password: string; // Password (required)
}

// This defines what the backend sends back after login/register
export interface AuthResponse {
  accessToken: string; // JWT token
  user: User; // User data
}

// This defines what errors from the API look like
export interface ApiError {
  statusCode: number; // HTTP status code (400, 401, 500, etc.)
  message: string | string[]; // Error message(s)
  error: string; // Error type (like "Unauthorized")
}
