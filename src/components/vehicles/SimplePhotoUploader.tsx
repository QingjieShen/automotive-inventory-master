'use client'

import { useState, useCallback, useRef } from 'react'
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { ImageType } from '@/types'
import Image from 'next/image'

interface UploadFile extends File {
  id: string
  preview?: string
  imageType?: ImageType
}

interface SimplePhotoUploaderProps {
  onFilesChange?: (files: UploadFile[]) => void
  maxFiles?: number
  maxFileSize?: number // in bytes
  acceptedFormats?: string[]
  className?: string
}

const DEFAULT_MAX_FILES = 20
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

const IMAGE_TYPE_OPTIONS: { value: ImageType; label: string }[] = [
  { value: 'FRONT_QUARTER', label: 'Front Quarter' },
  { value: 'FRONT', label: 'Front' },
  { value: 'BACK_QUARTER', label: 'Back Quarter' },
  { value: 'BACK', label: 'Back' },
  { value: 'DRIVER_SIDE', label: 'Driver Side' },
  { value: 'PASSENGER_SIDE', label: 'Passenger Side' },
  { value: 'GALLERY', label: 'Gallery' },
]

export default function SimplePhotoUploader({
  onFilesChange,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  className = ''
}: SimplePhotoUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate unique ID for files
  const generateFileId = () => Math.random().toString(36).substring(2, 15)

  // Validate file
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!acceptedFormats.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file format. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}`
      }
    }

    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: `File too large. Maximum size: ${formatFileSize(maxFileSize)}`
      }
    }

    return { valid: true }
  }

  // Create file preview
  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })
  }

  // Process and add files
  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    console.log('Processing files:', fileList) // Debug log
    const newFiles: UploadFile[] = []
    const filesToProcess = Array.from(fileList)

    // Check if adding these files would exceed the limit
    if (files.length + filesToProcess.length > maxFiles) {
      alert(`Cannot add more than ${maxFiles} files`)
      return
    }

    for (const file of filesToProcess) {
      const validation = validateFile(file)
      console.log('File validation:', file.name, validation) // Debug log
      
      if (!validation.valid) {
        alert(validation.error)
        continue
      }

      const fileId = generateFileId()
      
      const uploadFile: UploadFile = Object.assign(file, {
        id: fileId,
        imageType: 'GALLERY' as ImageType, // Default to gallery
      })

      try {
        uploadFile.preview = await createFilePreview(file)
        console.log('Preview created for:', file.name) // Debug log
      } catch (error) {
        console.error('Failed to create preview for file:', file.name, error)
        continue
      }

      newFiles.push(uploadFile)
    }

    const updatedFiles = [...files, ...newFiles]
    console.log('Updated files:', updatedFiles) // Debug log
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }, [files, maxFiles, maxFileSize, acceptedFormats, onFilesChange])

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles)
    }
  }, [processFiles])

  // Handle file input change
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
      // Reset input value to allow selecting the same files again
      e.target.value = ''
    }
  }, [processFiles])

  // Remove file
  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  // Update file image type
  const updateFileImageType = (fileId: string, imageType: ImageType) => {
    const updatedFiles = files.map(file => 
      file.id === fileId ? { ...file, imageType } : file
    )
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  // Clear all files
  const clearFiles = () => {
    setFiles([])
    onFilesChange?.([])
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="simple-file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Drop photos here or click to upload
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} up to {formatFileSize(maxFileSize)} each
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Maximum {maxFiles} files
              </span>
            </label>
            <input
              ref={fileInputRef}
              id="simple-file-upload"
              name="simple-file-upload"
              type="file"
              className="sr-only"
              multiple
              accept={acceptedFormats.join(',')}
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Selected Files ({files.length})
            </h4>
            <button
              onClick={clearFiles}
              className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {files.map((file) => (
              <FilePreview
                key={file.id}
                file={file}
                onRemove={() => removeFile(file.id)}
                onImageTypeChange={(imageType) => updateFileImageType(file.id, imageType)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface FilePreviewProps {
  file: UploadFile
  onRemove: () => void
  onImageTypeChange: (imageType: ImageType) => void
}

function FilePreview({ file, onRemove, onImageTypeChange }: FilePreviewProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      {/* Header with remove button */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700 truncate">
          {file.name}
        </span>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Remove file"
        >
          <XCircleIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Preview Image */}
      {file.preview && (
        <div className="relative aspect-[4/3] bg-gray-100 rounded mb-2 overflow-hidden">
          <Image
            src={file.preview}
            alt={file.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* File Info */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size)}
        </p>

        {/* Image Type Selector */}
        <select
          value={file.imageType || 'GALLERY'}
          onChange={(e) => onImageTypeChange(e.target.value as ImageType)}
          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          {IMAGE_TYPE_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}