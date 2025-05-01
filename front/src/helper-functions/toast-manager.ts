import { Toast } from "../contexts/ContextGlobalState"

export const addToast = (toast: { count: number; arr: Toast[] }, type: "green" | "yellow" | "red" | "close", txt: string) => {
  // Toast id
  const id = Date.now()

  // Add toast to the queue
  toast.arr.push({ id, type, txt })

  // Remove toast from the queue
  setTimeout(() => {
    toast.arr = toast.arr.filter((t) => id !== t.id)
    toast.count--
  }, 7000)
}
