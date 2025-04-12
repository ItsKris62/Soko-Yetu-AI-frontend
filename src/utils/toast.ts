import toast from 'react-hot-toast'

export const successToast = (msg: string) => toast.success(msg)
export const errorToast = (msg: string) => toast.error(msg)
