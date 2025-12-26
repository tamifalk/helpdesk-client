export interface IRegisterData {
    name: string;
    email: string;
    password: string;
}

export interface ILoginData {
    email: string;
    password: string;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'customer' | 'agent';
    is_active: boolean;
    created_at: string;
}

export interface AuthState {
    user: IUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    isProcessing: boolean;
}

export type AuthAction =
    | { type: 'LOGIN_SUCCESS'; payload: { user: IUser } } // צריך משתמש כדי להתחבר
    | { type: 'LOGOUT' }                                  // לא צריך מידע נוסף כדי להתנתק
    | { type: 'SET_LOADING'; payload: boolean }           // צריך לדעת אם זה true או false
    | { type: 'AUTH_ERROR'; payload: string }  
    | { type: 'SET_PROCESSING'; payload: boolean };          // צריך את הודעת השגיאה

