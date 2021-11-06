import { toast } from "react-toastify"

export const toastSuccess = (text) => {
  toast.success(text, {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined
  })
}

export const toastError = (text) => {
  toast.error(text || "Update failed!", {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: false,
    progress: undefined
  })
}
