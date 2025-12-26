
import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import type { AuthState, AuthAction, IUser } from '../types/auth.types';
import { GetMe } from '../services/auth.service';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    isProcessing: false,
};

// הרדוסר משתמש ב-AuthAction שהגדרת כדי לדעת אילו Cases קיימים
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user, // TypeScript יודע שיש כאן user בזכות ה-Type!
                loading: false,
                error: null,
            };
        case 'LOGOUT':
            return { ...initialState, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'AUTH_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_PROCESSING':
            return { ...state, isProcessing: action.payload };
        default:
            return state;
    }
};

interface AuthContextType extends AuthState {
    login: (user: IUser, token: string) => void;
    logout: () => void;
    clearError: () => void;
    setIsProcessing: (val: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            }
            try {
                const user = await GetMe();
                dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
            } catch (error) {
                // אם הייתה שגיאה (למשל טוקן פג תוקף), מנקים את המערכת
                localStorage.removeItem('token');
                dispatch({
                    type: 'AUTH_ERROR',
                    payload: 'החיבור פג תוקף, אנא התחבר שוב'
                });
            } finally {
                // בסוף הכל, מכבים את הטעינה כדי שהראוטר יציג את העמוד
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        initAuth();
    }, []);

    const login = (user: IUser, token: string) => {
        localStorage.setItem('token', token);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
    };

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    const clearError = () => {
        dispatch({ type: 'AUTH_ERROR', payload: null as any });
    };
    const setIsProcessing = (val: boolean) => {
        dispatch({ type: 'SET_PROCESSING', payload: val });
    }

    return (
        <AuthContext.Provider value={{ ...state, login, logout, clearError, setIsProcessing }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
export default AuthProvider;


