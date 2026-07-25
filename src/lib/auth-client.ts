import { createAuthClient } from "better-auth/react"

const isProduction = process.env.NODE_ENV === 'production';
const API_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction ? 'https://resoanance-neondb.onrender.com' : 'http://localhost:5000');

export const authClient = createAuthClient({
    baseURL: `${API_URL}/api/auth`
});

export const { signIn, signUp, signOut, useSession } = authClient;
