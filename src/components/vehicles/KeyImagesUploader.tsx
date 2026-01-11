'use client'

import { useState, useCallback } from 'react'
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { ImageType } from '@/types'
import Image from 'next/image'

interface UploadFile extends File {
  id: string
  preview?: string
  imageType: ImageType
}

interface KeyImagesUploaderProps {
  onFilesChange?: (files: UploadFile[]) => void
  className?: string
}

const KEY_IMAGE_SLOTS: { type: ImageType; label: string }[] = [
  { type: 'FRONT_QUARTER', label: 'Front Quarter' },
  { type: 'FRONT', label: 'Front' },
  { type: 'DRIVER_SIDE', label: 'Driver Side Profile' },
  { type: 'BACK_QUARTER', label: 'Back Quarter' },
  { type: 'BACK', label: 'Back' },
  { type: 'PASSENGER_SIDE', label: 'Passenger Side Profile' },
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

export default function KeyImagesUploader({
  onFilesChange,
  className = ''
}: KeyImagesUploaderProps) {
  const [slots, setSlots] = useState<Map<ImageType, UploadFile | null>>(
    new Map(KEY_IMAGE_SLOTS.map(slot => [slot.type, null]))
  )

  // Generate unique ID for files
  const generateFileId = () => Math.random().toString(36).substring(2, 15)

  // Validate file
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file format. Accepted formats: ${ACCEPTED_FORMATS.map(f => f.split('/')[1].toUpperCase()).join(', ')}`
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${formatFileSize(MAX_FILE_SIZE)}`
      }
    }

    return { valid: true }
  }

  // Create file preview
  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Handle file selection for a specific slot
  const handleFileSelect = useCallback(async (imageType: ImageType, file: File) => {
    const validation = validateFile(file)
    
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    try {
      const preview = await createFilePreview(file)
      const fileId = generateFileId()
      
      const uploadFile: UploadFile = Object.assign(file, {
        id: fileId,
        preview,
        imageType,
      })

      const newSlots = new Map(slots)
      newSlots.set(imageType, uploadFile)
      setSlots(newSlots)

      // Convert map to array of files, filtering out null values
      const filesArray = Array.from(newSlots.values()).filter((f): f is UploadFile => f !== null)
      onFilesChange?.(filesArray)
    } catch (error) {
      console.error('Failed to process file:', error)
      alert('Failed to process file. Please try again.')
    }
  }, [slots, onFilesChange])

  // Remove file from slot
  const removeFile = useCallback((imageType: ImageType) => {
    const newSlots = new Map(slots)
    newSlots.set(imageType, null)
    setSlots(newSlots)

    // Convert map to array of files, filtering out null values
    const filesArray = Array.from(newSlots.values()).filter((f): f is UploadFile => f !== null)
    onFilesChange?.(filesArray)
  }, [slots, onFilesChange])

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filledSlots = Array.from(slots.values()).filter(f => f !== null).length

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Info */}
      <div className="text-sm text-gray-600">
        {filledSlots} of 6 slots filled
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {KEY_IMAGE_SLOTS.map((slot) => (
          <KeyImageSlot
            key={slot.type}
            imageType={slot.type}
            label={slot.label}
            file={slots.get(slot.type) || null}
            onFileSelect={(file) => handleFileSelect(slot.type, file)}
            onRemove={() => removeFile(slot.type)}
          />
        ))}
      </div>
    </div>
  )
}

interface KeyImageSlotProps {
  imageType: ImageType
  label: string
  file: UploadFile | null
  onFileSelect: (file: File) => void
  onRemove: () => void
}

function KeyImageSlot({ imageType, label, file, onFileSelect, onRemove }: KeyImageSlotProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
      // Reset input value to allow selecting the same file again
      e.target.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
      {/* Slot Header */}
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
      </div>

      {/* Slot Content */}
      <div className="p-3">
        {file ? (
          // File Preview
          <div className="space-y-2">
            {/* Preview Image */}
            {file.preview && (
              <div className="relative aspect-[4/3] bg-gray-100 rounded overflow-hidden">
                <Image
                  src={file.preview}
                  alt={label}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            {/* File Info */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 truncate">
                {formatFileSize(file.size)}
              </span>
              <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Remove image"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          // Empty Slot - Upload Area
          <label
            htmlFor={`key-image-${imageType}`}
            className="block cursor-pointer"
          >
            <div className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <PhotoIcon className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-xs text-gray-500">Click to upload</span>
            </div>
            <input
              id={`key-image-${imageType}`}
              type="file"
              className="sr-only"
              accept={ACCEPTED_FORMATS.join(',')}
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  )
}
