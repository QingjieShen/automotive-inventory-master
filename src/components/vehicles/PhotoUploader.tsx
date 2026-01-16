'use client'

import { useState, useCallback, useRef } from 'react'
import { PhotoIcon, XCircleIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { ImageType } from '@/types'
import Image from 'next/image'
import { toast } from '@/lib/utils/toast'

interface UploadFile extends File {
  id: string
  preview?: string
  progress?: number
  status?: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
  imageType?: ImageType
}

interface PhotoUploaderProps {
  vehicleId?: string
  onUploadComplete?: (uploadedImages: any[]) => void
  onUploadProgress?: (progress: number) => void
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

export default function PhotoUploader({
  vehicleId,
  onUploadComplete,
  onUploadProgress,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  className = ''
}: PhotoUploaderProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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
    const newFiles: UploadFile[] = []
    const filesToProcess = Array.from(fileList)

    // Check if adding these files would exceed the limit
    if (files.length + filesToProcess.length > maxFiles) {
      toast.error('Upload limit exceeded', `Cannot add more than ${maxFiles} files`)
      return
    }

    for (const file of filesToProcess) {
      const validation = validateFile(file)
      const fileId = generateFileId()
      
      const uploadFile: UploadFile = Object.assign(file, {
        id: fileId,
        status: validation.valid ? ('pending' as const) : ('error' as const),
        error: validation.error,
        imageType: 'GALLERY' as ImageType, // Default to gallery
        progress: 0
      })

      if (validation.valid) {
        try {
          uploadFile.preview = await createFilePreview(file)
        } catch (error) {
          uploadFile.status = 'error'
          uploadFile.error = 'Failed to create preview'
        }
      }

      newFiles.push(uploadFile)
    }

    setFiles(prev => [...prev, ...newFiles])
  }, [files.length, maxFiles, maxFileSize, acceptedFormats])

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
    setFiles(prev => prev.filter(file => file.id !== fileId))
  }

  // Update file image type
  const updateFileImageType = (fileId: string, imageType: ImageType) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, imageType } : file
    ))
  }

  // Upload file to API
  const uploadFile = async (file: UploadFile): Promise<any> => {
    if (!vehicleId) {
      throw new Error('Vehicle ID is required for upload')
    }

    const formData = new FormData()
    formData.append(`file_0`, file)
    formData.append(`imageType_0`, file.imageType || 'GALLERY')

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          setFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, progress, status: 'uploading' as const }
              : f
          ))
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            setFiles(prev => prev.map(f => 
              f.id === file.id 
                ? { ...f, progress: 100, status: 'success' as const }
                : f
            ))
            resolve(response.images?.[0] || response)
          } catch (error) {
            setFiles(prev => prev.map(f => 
              f.id === file.id 
                ? { ...f, status: 'error' as const, error: 'Invalid response' }
                : f
            ))
            reject(new Error('Invalid response from server'))
          }
        } else {
          let errorMessage = 'Upload failed'
          try {
            const errorResponse = JSON.parse(xhr.responseText)
            errorMessage = errorResponse.error || errorMessage
          } catch (e) {
            // Use default error message
          }
          
          setFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'error' as const, error: errorMessage }
              : f
          ))
          reject(new Error(errorMessage))
        }
      })

      xhr.addEventListener('error', () => {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'error' as const, error: 'Network error' }
            : f
        ))
        reject(new Error('Network error'))
      })

      xhr.open('POST', `/api/vehicles/${vehicleId}/images`)
      xhr.send(formData)
    })
  }

  // Upload all files
  const uploadFiles = async () => {
    if (!vehicleId) {
      toast.error('Upload failed', 'Vehicle ID is required for upload')
      return
    }

    const pendingFiles = files.filter(f => f.status === 'pending')
    if (pendingFiles.length === 0) {
      return
    }

    setIsUploading(true)

    try {
      const uploadPromises = pendingFiles.map(file => uploadFile(file))
      const uploadedImages = await Promise.all(uploadPromises)
      
      onUploadComplete?.(uploadedImages)
      
      // Clear uploaded files
      setFiles(prev => prev.filter(f => f.status !== 'success'))
    } catch (error) {
      console.error('Upload failed:', error)
      // Errors are already handled in individual file uploads
    } finally {
      setIsUploading(false)
    }
  }

  // Clear all files
  const clearFiles = () => {
    setFiles([])
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Calculate overall progress
  const overallProgress = files.length > 0 
    ? files.reduce((sum, file) => sum + (file.progress || 0), 0) / files.length
    : 0

  const pendingFiles = files.filter(f => f.status === 'pending')
  const uploadingFiles = files.filter(f => f.status === 'uploading')
  const successFiles = files.filter(f => f.status === 'success')
  const errorFiles = files.filter(f => f.status === 'error')

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
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
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              multiple
              accept={acceptedFormats.join(',')}
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>
        </div>

        {/* Overall Progress Bar */}
        {isUploading && (
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1 text-center">
              Uploading... {Math.round(overallProgress)}%
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Selected Files ({files.length})
            </h4>
            <div className="flex space-x-2">
              {pendingFiles.length > 0 && vehicleId && (
                <button
                  onClick={uploadFiles}
                  disabled={isUploading}
                  className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : `Upload ${pendingFiles.length} files`}
                </button>
              )}
              <button
                onClick={clearFiles}
                disabled={isUploading}
                className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
            </div>
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

          {/* Status Summary */}
          {(successFiles.length > 0 || errorFiles.length > 0) && (
            <div className="flex items-center space-x-4 text-sm">
              {successFiles.length > 0 && (
                <div className="flex items-center text-green-600">
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  {successFiles.length} uploaded
                </div>
              )}
              {errorFiles.length > 0 && (
                <div className="flex items-center text-red-600">
                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                  {errorFiles.length} failed
                </div>
              )}
            </div>
          )}
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
  const getStatusIcon = () => {
    switch (file.status) {
      case 'success':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'error':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
      case 'uploading':
        return (
          <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )
      default:
        return null
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
    <div className={`bg-white border rounded-lg p-3 ${
      file.status === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      {/* Header with status and remove button */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-xs font-medium text-gray-700 truncate">
            {file.name}
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Remove file"
        >
          <XCircleIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Preview Image */}
      {file.preview && file.status !== 'error' && (
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

        {/* Progress Bar */}
        {file.status === 'uploading' && typeof file.progress === 'number' && (
          <div className="space-y-1">
            <div className="bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 text-center">
              {Math.round(file.progress)}%
            </p>
          </div>
        )}

        {/* Error Message */}
        {file.status === 'error' && file.error && (
          <p className="text-xs text-red-600">{file.error}</p>
        )}

        {/* Image Type Selector */}
        {file.status !== 'error' && (
          <select
            value={file.imageType || 'GALLERY'}
            onChange={(e) => onImageTypeChange(e.target.value as ImageType)}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            disabled={file.status === 'uploading'}
          >
            {IMAGE_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}