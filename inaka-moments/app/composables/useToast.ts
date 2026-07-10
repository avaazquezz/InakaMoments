export interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

let nextId = 1

/** Notificaciones tipo toast para el panel admin. Sin librería: array reactivo + auto-dismiss. */
export function useToast() {
  const toasts = useState<Toast[]>('admin-toasts', () => [])

  function dismiss(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function push(message: string, type: Toast['type'] = 'success', duration = 4000) {
    const id = nextId++
    toasts.value = [...toasts.value, { id, type, message }]
    if (import.meta.client) setTimeout(() => dismiss(id), duration)
  }

  return {
    toasts,
    success: (message: string) => push(message, 'success'),
    error: (message: string) => push(message, 'error'),
    info: (message: string) => push(message, 'info'),
    dismiss,
  }
}
