import type { ILoginData } from "../types/auth.types";
import { LoginUser } from "../services/auth.service";
import { AuthForm } from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import { useState } from "react";
import Loader from "../components/Loader";
import Header from "../components/Header";

const Login = () => {
    const { login, error } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (data: ILoginData) => {
        setIsSubmitting(true);
        try {
            const response = await LoginUser(data);
            login(response.user, response.token);
            navigate('/dashboard');
        } catch (error) {
            // כאן תוכל להציג הודעה למשתמש "שם משתמש או סיסמה שגויים"
            alert("שגיאה בהתחברות, בדוק את הפרטים");
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (<Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
         height: '100vh', 
            width: '100vw',
        p: 0
    }}>

        <Header />

        <Box sx={{
            flexGrow: 1, // דוחף את התוכן לתפוס את כל השטח שנותר מתחת להדר
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
        }}>
            <Box sx={{ width: '100%', maxWidth: 700 }}> {/* שומר על הרוחב שהגדרנו ב-AuthForm */}
                {isSubmitting && <Loader />}

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', direction: 'rtl' }}>
                        {error}
                    </Alert>
                )}

                <AuthForm type="login" onSubmit={handleLogin} />
            </Box>
        </Box>
    </Box>);
}

export default Login;