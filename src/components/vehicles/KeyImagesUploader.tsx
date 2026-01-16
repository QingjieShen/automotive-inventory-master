'use client'

import { useState, useCallback } from 'react'
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { ImageType } from '@/types'
import Image from 'next/image'
import { toast } from '@/lib/utils/toast'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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
  const [activeId, setActiveId] = useState<ImageType | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
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
      toast.error('Invalid file', validation.error)
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
      toast.error('Failed to process file', 'Please try again.')
    }
  }, [slots, onFilesChange])

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as ImageType)
  }

  // Handle drag end - swap images between slots
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over || active.id === over.id) {
      return
    }

    const sourceType = active.id as ImageType
    const targetType = over.id as ImageType

    // Swap the images between slots
    const newSlots = new Map(slots)
    const sourceFile = newSlots.get(sourceType)
    const targetFile = newSlots.get(targetType)

    // Swap the files and update their imageType
    if (sourceFile) {
      newSlots.set(targetType, { ...sourceFile, imageType: targetType })
    } else {
      newSlots.set(targetType, null)
    }

    if (targetFile) {
      newSlots.set(sourceType, { ...targetFile, imageType: sourceType })
    } else {
      newSlots.set(sourceType, null)
    }

    setSlots(newSlots)

    // Convert map to array of files, filtering out null values
    const filesArray = Array.from(newSlots.values()).filter((f): f is UploadFile => f !== null)
    onFilesChange?.(filesArray)
  }

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
        {filledSlots} of 6 slots filled • Drag images between slots to reorder
      </div>

      {/* Slots Grid with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={KEY_IMAGE_SLOTS.map(slot => slot.type)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {KEY_IMAGE_SLOTS.map((slot) => (
              <SortableKeyImageSlot
                key={slot.type}
                imageType={slot.type}
                label={slot.label}
                file={slots.get(slot.type) || null}
                onFileSelect={(file) => handleFileSelect(slot.type, file)}
                onRemove={() => removeFile(slot.type)}
                isDragging={activeId === slot.type}
              />
            ))}
          </div>
        </SortableContext>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId ? (
            <div className="bg-white border-2 border-blue-400 rounded-lg shadow-lg p-3 opacity-90">
              <div className="text-sm font-medium text-gray-900">
                {KEY_IMAGE_SLOTS.find(s => s.type === activeId)?.label}
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

interface SortableKeyImageSlotProps {
  imageType: ImageType
  label: string
  file: UploadFile | null
  onFileSelect: (file: File) => void
  onRemove: () => void
  isDragging: boolean
}

function SortableKeyImageSlot({ 
  imageType, 
  label, 
  file, 
  onFileSelect, 
  onRemove,
  isDragging: isActivelyDragging
}: SortableKeyImageSlotProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: imageType,
    disabled: !file, // Only allow dragging if there's a file in the slot
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? 'opacity-50 z-50' : ''}`}
    >
      <KeyImageSlot
        imageType={imageType}
        label={label}
        file={file}
        onFileSelect={onFileSelect}
        onRemove={onRemove}
        dragHandleProps={file ? { ...attributes, ...listeners } : undefined}
      />
    </div>
  )
}

interface KeyImageSlotProps {
  imageType: ImageType
  label: string
  file: UploadFile | null
  onFileSelect: (file: File) => void
  onRemove: () => void
  dragHandleProps?: any
}

function KeyImageSlot({ 
  imageType, 
  label, 
  file, 
  onFileSelect, 
  onRemove,
  dragHandleProps 
}: KeyImageSlotProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
      // Reset input value to allow selecting the same file again
      e.target.value = ''
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    // Only handle file drops, not image reordering
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    // Only handle file drops, not image reordering
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    // Only handle file drops, not image reordering
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      )
      
      if (droppedFiles.length > 0) {
        onFileSelect(droppedFiles[0]) // Only take the first file for this slot
      }
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
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden group">
      {/* Slot Header with Drag Handle */}
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        {/* Drag handle - only visible when there's a file */}
        {file && dragHandleProps && (
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
            title="Drag to reorder"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
            </svg>
          </div>
        )}
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
          // Empty Slot - Upload Area with Drag and Drop
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <label
              htmlFor={`key-image-${imageType}`}
              className="block cursor-pointer"
            >
              <div className={`aspect-[4/3] border-2 border-dashed rounded flex flex-col items-center justify-center transition-colors ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}>
                <PhotoIcon className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-xs text-gray-500">
                  {isDragOver ? 'Drop image here' : 'Click or drag to upload'}
                </span>
              </div>
              <input
                id={`key-image-${imageType}`}
                type="file"
                className="sr-only"
                accept={ACCEPTED_FORMATS.join(',')}
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
