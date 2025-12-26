import type { IRegisterData } from "../types/auth.types";
import { RegisterUser } from "../services/auth.service";
import { AuthForm } from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "../components/Loader";
import { Box } from "@mui/material";
import Header from "../components/Header";

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async (data: IRegisterData) => {
        setIsSubmitting(true);
        try {
            const response = await RegisterUser(data);
            login(response.user, response.token);
            navigate('/dashboard');
        } catch (error) {
            alert("שגיאה בהרשמה, בדוק את הפרטים");
        }
        finally {
            setIsSubmitting(false);
        }
    }
    return (<Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            height: '100vh', 
            width: '100vw',
            bgcolor: '#f8fafc',
            overflowX: 'hidden'
        }}>
            <Header />

            <Box component="main" sx={{ 
                flexGrow: 1, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                p: 3
            }}>
                <Box sx={{ width: '100%', maxWidth: 700 }}>
                    {isSubmitting && <Loader />}
                    
                    <AuthForm type="register" onSubmit={handleRegister} />
                </Box>
            </Box>
        </Box>)
}

export default Register;






