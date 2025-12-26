import Swal from "sweetalert2";

export const showErrorAlert = (message: string) => {
    Swal.fire({
        title: "אופס...",
        text: message,
        icon: "error",
        confirmButtonText: "סגור",
        confirmButtonColor: "#d32f2f",
        // כדאי להוסיף יישור לימין אם הפרויקט בעברית
        customClass: {
            popup: 'rtl-mode' 
        }
    });
};

export const showSuccessAlert = (message: string) => {
    Swal.fire({
        title: "הצלחנו!",
        text: message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
            popup: 'zindex-mode' 
        }
    });
};