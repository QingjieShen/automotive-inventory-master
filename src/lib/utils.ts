import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function generateStockNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'

  let result = ''
  // Add 1-2 letters
  for (let i = 0; i < Math.floor(Math.random() * 2) + 1; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length))
  }
  // Add 4-6 numbers
  for (let i = 0; i < Math.floor(Math.random() * 3) + 4; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length))
  }

  return result
}

export function validateStockNumber(stockNumber: string): boolean {
  return /^[A-Z0-9]{3,10}$/.test(stockNumber)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function getImageTypeDisplayName(imageType: string): string {
  const displayNames: Record<string, string> = {
    FRONT_QUARTER: 'Front Quarter',
    FRONT: 'Front',
    BACK_QUARTER: 'Back Quarter',
    BACK: 'Back',
    DRIVER_SIDE: 'Driver Side',
    PASSENGER_SIDE: 'Passenger Side',
    GALLERY: 'Gallery',
  }

  return displayNames[imageType] || imageType
}

export function getProcessingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    NOT_STARTED: 'text-gray-500',
    IN_PROGRESS: 'text-blue-500',
    COMPLETED: 'text-green-500',
    ERROR: 'text-red-500',
  }

  return colors[status] || 'text-gray-500'
}
