import { toast as sonnerToast } from 'sonner'

/**
 * Toast notification utility functions using sonner
 * Provides consistent toast notifications across the application
 */

export const toast = {
  /**
   * Display a success toast notification
   * @param message - The success message to display
   * @param description - Optional description for additional context
   */
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
      duration: 4000,
    })
  },

  /**
   * Display an error toast notification
   * @param message - The error message to display
   * @param description - Optional description for additional context
   */
  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
      duration: 5000,
    })
  },

  /**
   * Display an info toast notification
   * @param message - The info message to display
   * @param description - Optional description for additional context
   */
  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
      duration: 4000,
    })
  },

  /**
   * Display a warning toast notification
   * @param message - The warning message to display
   * @param description - Optional description for additional context
   */
  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
      duration: 4000,
    })
  },

  /**
   * Display a loading toast notification
   * @param message - The loading message to display
   * @returns Toast ID that can be used to dismiss or update the toast
   */
  loading: (message: string) => {
    return sonnerToast.loading(message)
  },

  /**
   * Dismiss a specific toast by ID
   * @param toastId - The ID of the toast to dismiss
   */
  dismiss: (toastId?: string | number) => {
    return sonnerToast.dismiss(toastId)
  },

  /**
   * Display a promise toast that updates based on promise state
   * @param promise - The promise to track
   * @param messages - Messages for loading, success, and error states
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return sonnerToast.promise(promise, messages)
  },
}
