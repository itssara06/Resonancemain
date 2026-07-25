import { createAuthClient } from "better-auth/react"

const isProduction = process.env.NODE_ENV === 'production';
const API_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction ? 'https://resoanance-neondb.onrender.com/api' : 'http://localhost:5000/api');

const baseURL = API_URL.endsWith('/api') ? `${API_URL}/auth` : `${API_URL}/api/auth`;

export const authClient = createAuthClient({
    baseURL
});

export const { signIn, signUp, signOut, useSession } = authClient;
