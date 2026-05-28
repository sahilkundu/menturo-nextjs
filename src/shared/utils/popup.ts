import Swal from "sweetalert2"

export const showPopupMessage = (
    message: string,
    isSuccess: boolean = false
) => {

    Swal.fire({

        icon:
            isSuccess
                ? "success"
                : "error",

        title:
            isSuccess
                ? "Success"
                : "Error",

        text: message,

        confirmButtonColor:
            isSuccess
                ? "#2575fc"
                : "#d33",

        toast: true,

        position: "top-end",

        timer: 3000,

        showConfirmButton: false
    })
}