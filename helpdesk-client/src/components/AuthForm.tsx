import { useForm } from "react-hook-form";
import { TextField, Button, Box, Typography, Paper, Link as MuiLink } from "@mui/material";
import { Link } from "react-router-dom";

interface AuthFormProps {
    type: "login" | "register";
    onSubmit: (data: any) => void;
}

export const AuthForm = ({ type, onSubmit }: AuthFormProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <Box sx={{
            minWidth: '100%',
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 4, sm: 6, md: 10 },
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', // רקע מדורג עדין
        }}>
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 5, md: 7 },
                    borderRadius: '24px',
                    textAlign: 'center',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    border: '1px solid #ffffff',
                    maxWidth: 550,
                    width: '100%',
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    direction: 'rtl',
                }}
            >
                {/* כותרת מודגשת */}
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: '#1e293b' }}>
                    {type === "login" ? "ברוכים השבים" : "יצירת חשבון"}
                </Typography>

                <Typography variant="body1" sx={{ color: '#64748b', mb: 5, fontWeight: 500 }}>
                    {type === "login" ? "שמחים לראות אתכם שוב!" : "הצטרפו למערכת ניהול הפניות שלנו"}
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}
                >
                    {type === "register" && (
                        <TextField
                            label="שם מלא"
                            variant="outlined"
                            fullWidth
                            {...register("name", { required: "שם הוא שדה חובה" })}
                            error={!!errors.name}
                            helperText={errors.name?.message as string}
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
                        />
                    )}

                    <TextField
                        label="כתובת אימייל"
                        type="email"
                        variant="outlined"
                        fullWidth
                        {...register("email", { required: "אימייל הוא שדה חובה" })}
                        error={!!errors.email}
                        helperText={errors.email?.message as string}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
                    />

                    <TextField
                        label="סיסמה"
                        type="password"
                        variant="outlined"
                        fullWidth
                        {...register("password", {
                            required: "סיסמה היא שדה חובה",
                            minLength: { value: 6, message: "לפחות 6 תווים" }
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message as string}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                            py: 2,
                            borderRadius: '12px',
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            mt: 2,
                            background: '#2563eb',
                            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)',
                            textTransform: 'none',
                            '&:hover': {
                                background: '#1d4ed8',
                                boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4)',
                            }
                        }}
                    >
                        {type === "login" ? "כניסה למערכת" : "הרשמה עכשיו"}
                    </Button>

                    <Box sx={{ mt: 2 }}>
                        <MuiLink
                            component={Link}
                            to={type === "login" ? "/register" : "/login"}
                            sx={{
                                fontWeight: 700,
                                textDecoration: 'none',
                                color: '#475569',
                                transition: 'color 0.2s',
                                '&:hover': { color: '#2563eb' }
                            }}
                        >
                            {type === "login" ? "עדיין אין לכם חשבון? צרו אחד כאן" : "כבר רשומים? חזרו להתחברות"}
                        </MuiLink>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};