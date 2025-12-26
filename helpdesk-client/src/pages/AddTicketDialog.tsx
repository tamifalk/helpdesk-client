import { useEffect, useState, type FunctionComponent } from "react";
import type { CreateTicketDto, Priority } from "../types/ticket.types";
import { useForm } from "react-hook-form";
import { getPriorities } from "../services/ticket.service";
import {
    Button, TextField, Dialog, DialogTitle, DialogContent,
    DialogActions, MenuItem, Stack
} from "@mui/material";
import { useTickets } from "../context/TicketsContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AddTicketDialogProps {

}

const AddTicketDialog: FunctionComponent<AddTicketDialogProps> = () => {
    const [priorities, setPriorities] = useState<Priority[]>([]);
    const { addTicket } = useTickets();
    const navigate = useNavigate();
    const { setIsProcessing } = useAuth();




    useEffect(() => {
        const fetchPriorities = async () => {
            try {
                setIsProcessing(true);
                const priorities = await getPriorities();
                setPriorities(priorities);
            } catch (error) {
                console.error("Failed to fetch priorities:", error);
            }
            finally {
                setIsProcessing(false);
            }
        };

        fetchPriorities();
    }, []);

    const handleClose = () => {
        navigate("/dashboard/tickets");
    };

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateTicketDto>({
        defaultValues: {
            subject: '',
            description: '',
            priority_id: 1,
            status_id: 0,
            assigned_to: 0
        }
    });

    const onSubmit = async (data: CreateTicketDto) => {
        try {
            setIsProcessing(true);
            await addTicket(data);
            reset();
            handleClose();
        } catch (error) {
            console.error("Failed to create ticket:", error);
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
            <DialogTitle sx={{
                fontWeight: 800,
                textAlign: 'center',
                direction: 'rtl'
            }}>
                פתיחת פנייה חדשה
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="נושא הפנייה"
                            {...register("subject", { required: "חובה להזין נושא" })}
                            error={!!errors.subject}
                            helperText={errors.subject?.message}
                            inputProps={{ dir: 'rtl' }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="תיאור הפנייה"
                            {...register("description", { required: "חובה להזין תיאור" })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            inputProps={{ dir: 'rtl' }}

                        />

                        {/* שדה בחירה (Select) לעדיפות */}
                        <TextField
                            select
                            fullWidth
                            label="עדיפות"
                            defaultValue={1}
                            {...register("priority_id", { valueAsNumber: true })}

                        >
                            {priorities.map(priority => (
                                <MenuItem
                                    key={priority.id}
                                    value={priority.id}

                                >
                                    {priority.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleClose} color="inherit" >
                        ביטול
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            bgcolor: '#1A2027',
                            px: 4,
                            borderRadius: '10px'
                        }}
                    >
                        {isSubmitting ? 'שולח...' : 'שמירה'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AddTicketDialog;