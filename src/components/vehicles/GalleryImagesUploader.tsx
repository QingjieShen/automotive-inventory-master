'use client'

import { useState, useCallback, useRef } from 'react'
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
  DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface UploadFile extends File {
  id: string
  preview?: string
  imageType: ImageType
}

interface GalleryImagesUploaderProps {
  onFilesChange?: (files: UploadFile[]) => void
  maxFiles?: number
  maxFileSize?: number // in bytes
  acceptedFormats?: string[]
  className?: string
}

const DEFAULT_MAX_FILES = 60
const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const DEFAULT_ACCEPTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

export default function GalleryImagesUploader({
  onFilesChange,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  className = ''
}: GalleryImagesUploaderProps) {
  const [exteriorFiles, setExteriorFiles] = useState<UploadFile[]>([])
  const [interiorFiles, setInteriorFiles] = useState<UploadFile[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Process and add files
  const processFiles = useCallback(async (fileList: FileList | File[], imageType: ImageType) => {
    const newFiles: UploadFile[] = []
    const filesToProcess = Array.from(fileList)

    const totalFiles = exteriorFiles.length + interiorFiles.length
    if (totalFiles + filesToProcess.length > maxFiles) {
      toast.error('Upload limit exceeded', `Cannot add more than ${maxFiles} files`)
      return
    }

    for (const file of filesToProcess) {
      const validation = validateFile(file)
      
      if (!validation.valid) {
        toast.error('Invalid file', validation.error)
        continue
      }

      const fileId = generateFileId()
      
      const uploadFile: UploadFile = Object.assign(file, {
        id: fileId,
        imageType,
      })

      try {
        uploadFile.preview = await createFilePreview(file)
      } catch (error) {
        console.error('Failed to create preview for file:', file.name, error)
        continue
      }

      newFiles.push(uploadFile)
    }

    if (imageType === 'GALLERY_EXTERIOR') {
      const updated = [...exteriorFiles, ...newFiles]
      setExteriorFiles(updated)
      notifyChange(updated, interiorFiles)
    } else {
      const updated = [...interiorFiles, ...newFiles]
      setInteriorFiles(updated)
      notifyChange(exteriorFiles, updated)
    }
  }, [exteriorFiles, interiorFiles, maxFiles, maxFileSize, acceptedFormats])

  // Notify parent of changes
  const notifyChange = (exterior: UploadFile[], interior: UploadFile[]) => {
    const allFiles = [...exterior, ...interior]
    onFilesChange?.(allFiles)
  }

  // Remove file
  const removeFile = (fileId: string, imageType: ImageType) => {
    if (imageType === 'GALLERY_EXTERIOR') {
      const updated = exteriorFiles.filter(f => f.id !== fileId)
      setExteriorFiles(updated)
      notifyChange(updated, interiorFiles)
    } else {
      const updated = interiorFiles.filter(f => f.id !== fileId)
      setInteriorFiles(updated)
      notifyChange(exteriorFiles, updated)
    }
  }

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    setOverId(over?.id as string | null)
  }

  // Handle drag end - move images between containers OR reorder within container
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setOverId(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Find the active file
    const activeInExterior = exteriorFiles.find(f => f.id === activeId)
    const activeInInterior = interiorFiles.find(f => f.id === activeId)
    const activeFile = activeInExterior || activeInInterior
    
    if (!activeFile) return

    // Find the over file (if it's a file, not a container)
    const overFileInExterior = exteriorFiles.find(f => f.id === overId)
    const overFileInInterior = interiorFiles.find(f => f.id === overId)
    const overFile = overFileInExterior || overFileInInterior

    // If dragging over another file in the same container, reorder
    if (overFile) {
      if (activeInExterior && overFileInExterior) {
        // Reorder within exterior
        const oldIndex = exteriorFiles.findIndex(f => f.id === activeId)
        const newIndex = exteriorFiles.findIndex(f => f.id === overId)
        
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reordered = [...exteriorFiles]
          const [removed] = reordered.splice(oldIndex, 1)
          reordered.splice(newIndex, 0, removed)
          setExteriorFiles(reordered)
          notifyChange(reordered, interiorFiles)
        }
        return
      } else if (activeInInterior && overFileInInterior) {
        // Reorder within interior
        const oldIndex = interiorFiles.findIndex(f => f.id === activeId)
        const newIndex = interiorFiles.findIndex(f => f.id === overId)
        
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reordered = [...interiorFiles]
          const [removed] = reordered.splice(oldIndex, 1)
          reordered.splice(newIndex, 0, removed)
          setInteriorFiles(reordered)
          notifyChange(exteriorFiles, reordered)
        }
        return
      } else {
        // Different containers - move between them
        if (activeInExterior && overFileInInterior) {
          // Move from exterior to interior
          const newExterior = exteriorFiles.filter(f => f.id !== activeId)
          const movedFile = { ...activeFile, imageType: 'GALLERY_INTERIOR' as ImageType }
          const newInterior = [...interiorFiles, movedFile]
          setExteriorFiles(newExterior)
          setInteriorFiles(newInterior)
          notifyChange(newExterior, newInterior)
        } else if (activeInInterior && overFileInExterior) {
          // Move from interior to exterior
          const newInterior = interiorFiles.filter(f => f.id !== activeId)
          const movedFile = { ...activeFile, imageType: 'GALLERY_EXTERIOR' as ImageType }
          const newExterior = [...exteriorFiles, movedFile]
          setInteriorFiles(newInterior)
          setExteriorFiles(newExterior)
          notifyChange(newExterior, newInterior)
        }
        return
      }
    }

    // Determine target container (for dropping on empty container)
    const isOverExteriorContainer = overId === 'exterior-container'
    const isOverInteriorContainer = overId === 'interior-container'

    let targetContainer: 'exterior' | 'interior' | null = null

    if (isOverExteriorContainer) {
      targetContainer = 'exterior'
    } else if (isOverInteriorContainer) {
      targetContainer = 'interior'
    }

    if (!targetContainer) return

    // Move file between containers
    if (activeInExterior && targetContainer === 'interior') {
      // Move from exterior to interior
      const newExterior = exteriorFiles.filter(f => f.id !== activeId)
      const movedFile = { ...activeFile, imageType: 'GALLERY_INTERIOR' as ImageType }
      const newInterior = [...interiorFiles, movedFile]
      setExteriorFiles(newExterior)
      setInteriorFiles(newInterior)
      notifyChange(newExterior, newInterior)
    } else if (activeInInterior && targetContainer === 'exterior') {
      // Move from interior to exterior
      const newInterior = interiorFiles.filter(f => f.id !== activeId)
      const movedFile = { ...activeFile, imageType: 'GALLERY_EXTERIOR' as ImageType }
      const newExterior = [...exteriorFiles, movedFile]
      setInteriorFiles(newInterior)
      setExteriorFiles(newExterior)
      notifyChange(newExterior, newInterior)
    }
  }

  const totalFiles = exteriorFiles.length + interiorFiles.length
  const activeFile = activeId 
    ? exteriorFiles.find(f => f.id === activeId) || interiorFiles.find(f => f.id === activeId)
    : null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Info */}
      <div className="text-sm text-gray-600">
        {totalFiles} of {maxFiles} images • Drag to reorder within category or move between categories
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Exterior Images Container */}
        <GalleryContainer
          title="Exterior Images"
          files={exteriorFiles}
          imageType="GALLERY_EXTERIOR"
          onFilesAdd={(files) => processFiles(files, 'GALLERY_EXTERIOR')}
          onFileRemove={(fileId) => removeFile(fileId, 'GALLERY_EXTERIOR')}
          acceptedFormats={acceptedFormats}
          maxFileSize={maxFileSize}
          isOver={overId === 'exterior-container'}
        />

        {/* Interior Images Container */}
        <GalleryContainer
          title="Interior Images"
          files={interiorFiles}
          imageType="GALLERY_INTERIOR"
          onFilesAdd={(files) => processFiles(files, 'GALLERY_INTERIOR')}
          onFileRemove={(fileId) => removeFile(fileId, 'GALLERY_INTERIOR')}
          acceptedFormats={acceptedFormats}
          maxFileSize={maxFileSize}
          isOver={overId === 'interior-container'}
        />

        {/* Drag Overlay */}
        <DragOverlay>
          {activeFile ? (
            <div className="bg-white border-2 border-blue-400 rounded-lg shadow-lg p-3 opacity-90 w-48">
              {activeFile.preview && (
                <div className="relative aspect-[4/3] bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={activeFile.preview}
                    alt="Dragging"
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

interface GalleryContainerProps {
  title: string
  files: UploadFile[]
  imageType: ImageType
  onFilesAdd: (files: FileList | File[]) => void
  onFileRemove: (fileId: string) => void
  acceptedFormats: string[]
  maxFileSize: number
  isOver: boolean
}

function GalleryContainer({
  title,
  files,
  imageType,
  onFilesAdd,
  onFileRemove,
  acceptedFormats,
  maxFileSize,
  isOver,
}: GalleryContainerProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerId = imageType === 'GALLERY_EXTERIOR' ? 'exterior-container' : 'interior-container'

  const { setNodeRef } = useSortable({
    id: containerId,
  })

  const handleDragEnter = (e: React.DragEvent) => {
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
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      )
      
      if (droppedFiles.length > 0) {
        onFilesAdd(droppedFiles)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdd(e.target.files)
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
    <div
      ref={setNodeRef}
      className={`bg-white border-2 rounded-lg p-4 transition-colors ${
        isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-600">{files.length} images</span>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 mb-4 transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <PhotoIcon className="mx-auto h-10 w-10 text-gray-400" />
          <div className="mt-3">
            <label htmlFor={`${imageType}-upload`} className="cursor-pointer">
              <span className="block text-sm font-medium text-gray-900">
                {isDragOver ? 'Drop images here' : 'Drop images here or click to upload'}
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} up to {formatFileSize(maxFileSize)}
              </span>
            </label>
            <input
              ref={fileInputRef}
              id={`${imageType}-upload`}
              type="file"
              className="sr-only"
              multiple
              accept={acceptedFormats.join(',')}
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </div>

      {/* Images Grid */}
      {files.length > 0 ? (
        <SortableContext items={files.map(f => f.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((file) => (
              <SortableImagePreview
                key={file.id}
                file={file}
                onRemove={() => onFileRemove(file.id)}
              />
            ))}
          </div>
        </SortableContext>
      ) : (
        <div className="text-center py-8 text-gray-500 text-sm">
          No {title.toLowerCase()} yet
        </div>
      )}
    </div>
  )
}

interface SortableImagePreviewProps {
  file: UploadFile
  onRemove: () => void
}

function SortableImagePreview({ file, onRemove }: SortableImagePreviewProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white border border-gray-200 rounded-lg overflow-hidden ${
        isDragging ? 'opacity-50 z-50' : ''
      }`}
      {...attributes}
      {...listeners}
    >
      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-1 rounded-full shadow-lg"
        title="Remove image"
      >
        <XCircleIcon className="h-4 w-4" />
      </button>

      {/* Drag handle indicator */}
      <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <div 
          className="bg-black bg-opacity-50 text-white p-1 rounded text-xs cursor-grab active:cursor-grabbing"
          aria-label="Drag to move"
        >
          ⋮⋮
        </div>
      </div>

      {/* Preview Image */}
      {file.preview && (
        <div className="relative aspect-[4/3] bg-gray-100">
          <Image
            src={file.preview}
            alt={file.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        </div>
      )}
    </div>
  )
}
