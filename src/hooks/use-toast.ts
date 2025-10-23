"use client"

import * as React from "react"
import { toast as sonnerToast } from "sonner"

type ToastActionElement = React.ReactElement

type ToastProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

type ToasterToast = ToastProps & {
  id: string
}

interface State {
  toasts: ToasterToast[]
}

const TOAST_LIMIT = 1

// In-memory state to track toasts
let memoryState: State = { toasts: [] }
const listeners: Array<(state: State) => void> = []

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

function notifyListeners() {
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function addToast(toast: ToasterToast) {
  memoryState = {
    ...memoryState,
    toasts: [toast, ...memoryState.toasts].slice(0, TOAST_LIMIT),
  }
  notifyListeners()
}

function updateToast(id: string, toast: Partial<ToasterToast>) {
  memoryState = {
    ...memoryState,
    toasts: memoryState.toasts.map((t) =>
      t.id === id ? { ...t, ...toast } : t
    ),
  }
  notifyListeners()
}

function dismissToast(toastId?: string) {
  if (toastId) {
    sonnerToast.dismiss(toastId)
    memoryState = {
      ...memoryState,
      toasts: memoryState.toasts.map((t) =>
        t.id === toastId ? { ...t, open: false } : t
      ),
    }
  } else {
    // Dismiss all
    memoryState.toasts.forEach((t) => sonnerToast.dismiss(t.id))
    memoryState = {
      ...memoryState,
      toasts: memoryState.toasts.map((t) => ({ ...t, open: false })),
    }
  }
  notifyListeners()
}

function removeToast(toastId?: string) {
  if (toastId === undefined) {
    memoryState = { toasts: [] }
  } else {
    memoryState = {
      ...memoryState,
      toasts: memoryState.toasts.filter((t) => t.id !== toastId),
    }
  }
  notifyListeners()
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (newProps: Partial<ToasterToast>) => {
    updateToast(id, newProps)
    
    // Update Sonner toast
    const actionButton = newProps.action || props.action
    const variant = newProps.variant || props.variant
    const title = newProps.title || props.title
    const description = newProps.description || props.description

    sonnerToast.dismiss(id)
    
    if (variant === "destructive") {
      sonnerToast.error(title, {
        id,
        description,
        action: actionButton,
      })
    } else {
      sonnerToast(title, {
        id,
        description,
        action: actionButton,
      })
    }
  }

  const dismiss = () => {
    dismissToast(id)
  }

  // Add to memory state
  const toastData: ToasterToast = {
    ...props,
    id,
    open: true,
    onOpenChange: (open) => {
      if (!open) dismiss()
    },
  }
  addToast(toastData)

  // Show Sonner toast
  const actionButton = props.action

  if (props.variant === "destructive") {
    sonnerToast.error(props.title, {
      id,
      description: props.description,
      action: actionButton,
      onDismiss: () => removeToast(id),
      onAutoClose: () => removeToast(id),
    })
  } else {
    sonnerToast(props.title, {
      id,
      description: props.description,
      action: actionButton,
      onDismiss: () => removeToast(id),
      onAutoClose: () => removeToast(id),
    })
  }

  return {
    id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dismissToast(toastId),
  }
}

export { useToast, toast }