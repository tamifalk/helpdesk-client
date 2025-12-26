    import { useState, type FunctionComponent } from "react";
    import { useForm } from "react-hook-form";
    import { useNavigate, useRevalidator } from "react-router-dom";
    import type { IUser } from "../types/auth.types";
    import { AddUser } from "../services/user.service";
    import Dialog from "@mui/material/Dialog";
    import { Button, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Stack, TextField } from "@mui/material";
    import Visibility from '@mui/icons-material/Visibility';
    import VisibilityOff from '@mui/icons-material/VisibilityOff';
    import { useAuth } from "../context/AuthContext";
import { showErrorAlert, showSuccessAlert } from "../utils/alerts";

    interface AddUserDialogProps {

    }

    const AddUserDialog: FunctionComponent<AddUserDialogProps> = () => {
        const navigate = useNavigate();
        const customFont = "'Assistant', sans-serif";
        const [showPassword, setShowPassword] = useState(false);
        const { revalidate } = useRevalidator();
        const { setIsProcessing } = useAuth();  

        const roles = [
            { value: 'customer', label: 'לקוח' },
            { value: 'agent', label: 'סוכן' },
            { value: 'admin', label: 'מנהל מערכת' }
        ];

        //סגירת הדיאלוג
        const handleClose = () => {
            navigate("/dashboard/users");
        };

        const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<IUser>({
            defaultValues: {
                id: 0,
                name: '',
                email: '',
                role: 'customer',
                password: '',
            }
        });

        const onSubmit = async (user: IUser) => {
            try {
                setIsProcessing(true);
                await AddUser(user);
                revalidate();
                showSuccessAlert("המשתמש נוסף בהצלחה!");
                reset();
                handleClose();
            } catch (error: any) {
                const msg = error.response?.data?.message || "לא הצלחנו להוסיף את המשתמש";
                showErrorAlert(msg)
            }
            finally {
                setIsProcessing(false);
            }
        }

        return (
            <Dialog
                open={true}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
            >
                <DialogTitle sx={{ fontFamily: customFont, fontWeight: 800 }}>
                    הוספת משתמש חדש למערכת
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            {/* שם מלא */}
                            <TextField
                                fullWidth
                                label="שם מלא"
                                {...register("name", { required: "חובה להזין שם מלא" })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                sx={{ '& .MuiInputBase-root': { fontFamily: customFont } }}
                            />

                            {/* אימייל */}
                            <TextField
                                fullWidth
                                label="כתובת אימייל"
                                type="email"
                                {...register("email", { 
                                    required: "חובה להזין אימייל",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "כתובת אימייל לא תקינה"
                                    }
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                sx={{ '& .MuiInputBase-root': { fontFamily: customFont } }}
                            />

                            <TextField
                                fullWidth
                                label="סיסמה ראשונית"
                                type={showPassword ? "text" : "password"}
                                {...register("password", { 
                                    required: "חובה להזין סיסמה",
                                    minLength: { value: 6, message: "סיסמה חייבת להכיל לפחות 6 תווים" }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                sx={{ '& .MuiInputBase-root': { fontFamily: customFont } }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* בחירת תפקיד */}
                            <TextField
                                select
                                fullWidth
                                label="תפקיד במערכת"
                                defaultValue="customer"
                                {...register("role", { required: "חובה לבחור תפקיד" })}
                                sx={{ '& .MuiInputBase-root': { fontFamily: customFont } }}
                            >
                                {roles.map((option) => (
                                    <MenuItem 
                                        key={option.value} 
                                        value={option.value}
                                        sx={{ fontFamily: customFont }}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Button 
                            onClick={handleClose} 
                            color="inherit" 
                            sx={{ fontFamily: customFont }}
                        >
                            ביטול
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting}
                            sx={{
                                fontFamily: customFont,
                                bgcolor: '#1A2027',
                                px: 4,
                                borderRadius: '10px',
                                '&:hover': { bgcolor: '#333' }
                            }}
                        >
                            {isSubmitting ? 'מעבד...' : 'צור משתמש'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );


    }

    export default AddUserDialog;