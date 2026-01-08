'use client'

import { useState } from 'react'
import { Vehicle, VehicleImage, ImageType, ProcessingStatus } from '@/types'
import Image from 'next/image'
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DeleteImageModal from './DeleteImageModal'
import ProcessingButton from './ProcessingButton'

interface ImageGalleryProps {
  vehicle: Vehicle
  onVehicleUpdate: (vehicle: Vehicle) => void
}

export default function ImageGallery({ vehicle, onVehicleUpdate }: ImageGalleryProps) {
  const [isReordering, setIsReordering] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<VehicleImage | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [processingImages, setProcessingImages] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Separate key images from gallery images
  const keyImageTypes: ImageType[] = [
    'FRONT_QUARTER',
    'FRONT', 
    'BACK_QUARTER',
    'BACK',
    'DRIVER_SIDE',
    'PASSENGER_SIDE'
  ]

  const keyImages = vehicle.images.filter(img => keyImageTypes.includes(img.imageType))
  const galleryImages = vehicle.images.filter(img => img.imageType === 'GALLERY')

  // Sort key images by type order (these don't get reordered, they have fixed positions)
  const sortedKeyImages = keyImageTypes.map(type => 
    keyImages.find(img => img.imageType === type)
  ).filter(Boolean) as VehicleImage[]

  // Sort gallery images by sortOrder for drag-and-drop
  const sortedGalleryImages = [...galleryImages].sort((a, b) => a.sortOrder - b.sortOrder)

  // Get front image for the individual row
  const frontImage = sortedKeyImages.find(img => img.imageType === 'FRONT')
  const otherKeyImages = sortedKeyImages.filter(img => img.imageType !== 'FRONT')

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = sortedGalleryImages.findIndex(img => img.id === active.id)
    const newIndex = sortedGalleryImages.findIndex(img => img.id === over.id)

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    // Reorder the gallery images array
    const reorderedImages = arrayMove(sortedGalleryImages, oldIndex, newIndex)
    
    // Update sort orders
    const updatedImages = reorderedImages.map((img, index) => ({
      ...img,
      sortOrder: index
    }))

    // Update the vehicle with new image order
    const updatedVehicle = {
      ...vehicle,
      images: [
        ...sortedKeyImages, // Key images maintain their positions
        ...updatedImages    // Gallery images with new order
      ]
    }

    // Optimistically update the UI
    onVehicleUpdate(updatedVehicle)

    // Persist the changes to the server
    try {
      setIsReordering(true)
      const response = await fetch(`/api/vehicles/${vehicle.id}/images/reorder`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUpdates: updatedImages.map(img => ({
            id: img.id,
            sortOrder: img.sortOrder
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update image order')
      }

      // Refresh vehicle data to ensure consistency
      const vehicleResponse = await fetch(`/api/vehicles/${vehicle.id}`)
      if (vehicleResponse.ok) {
        const refreshedVehicle = await vehicleResponse.json()
        onVehicleUpdate(refreshedVehicle)
      }
    } catch (error) {
      console.error('Error updating image order:', error)
      // Revert the optimistic update on error
      onVehicleUpdate(vehicle)
    } finally {
      setIsReordering(false)
    }
  }

  const handleDeleteImage = async (image: VehicleImage) => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/vehicles/${vehicle.id}/images/${image.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      // Remove the image from the vehicle state
      const updatedImages = vehicle.images.filter(img => img.id !== image.id)
      
      // If it's a gallery image, update sort orders for remaining gallery images
      if (image.imageType === 'GALLERY') {
        const galleryImages = updatedImages
          .filter(img => img.imageType === 'GALLERY')
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((img, index) => ({ ...img, sortOrder: index }))
        
        // Update the images array with new sort orders
        const keyImages = updatedImages.filter(img => img.imageType !== 'GALLERY')
        updatedImages.splice(0, updatedImages.length, ...keyImages, ...galleryImages)
      }

      const updatedVehicle = {
        ...vehicle,
        images: updatedImages
      }

      onVehicleUpdate(updatedVehicle)
      setImageToDelete(null)
    } catch (error) {
      console.error('Error deleting image:', error)
      // TODO: Show error toast/notification
    } finally {
      setIsDeleting(false)
    }
  }

  const handleProcessingStart = () => {
    // Update vehicle processing status optimistically
    const updatedVehicle = {
      ...vehicle,
      processingStatus: 'IN_PROGRESS' as const
    }
    onVehicleUpdate(updatedVehicle)
  }

  const handleProcessingComplete = (updatedImage: VehicleImage) => {
    // Update the specific image in the vehicle state
    const updatedImages = vehicle.images.map(img => 
      img.id === updatedImage.id ? updatedImage : img
    )
    
    // Check if all key images are processed to update vehicle status
    const keyImages = updatedImages.filter(img => img.imageType !== 'GALLERY')
    const allKeyImagesProcessed = keyImages.length > 0 && keyImages.every(img => img.isProcessed)
    
    const updatedVehicle = {
      ...vehicle,
      images: updatedImages,
      processingStatus: allKeyImagesProcessed ? 'COMPLETED' as const : vehicle.processingStatus
    }
    
    onVehicleUpdate(updatedVehicle)
  }

  return (
    <div className="space-y-8">
      {/* Key Images Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Images</h2>
        
        {/* Front shot in individual row */}
        {frontImage && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Front Shot</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <ImageCard 
                image={frontImage} 
                isDraggable={false} 
                onDelete={() => setImageToDelete(frontImage)}
                vehicleId={vehicle.id}
                processingStatus={vehicle.processingStatus}
                onProcessingStart={handleProcessingStart}
                onProcessingComplete={handleProcessingComplete}
              />
            </div>
          </div>
        )}

        {/* Other 5 key shots in two rows */}
        {otherKeyImages.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Other Key Shots</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherKeyImages.map((image) => (
                <div key={image.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <ImageCard 
                    image={image} 
                    isDraggable={false} 
                    onDelete={() => setImageToDelete(image)}
                    vehicleId={vehicle.id}
                    processingStatus={vehicle.processingStatus}
                    onProcessingStart={handleProcessingStart}
                    onProcessingComplete={handleProcessingComplete}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state for missing key images */}
        {sortedKeyImages.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No key images uploaded yet</p>
          </div>
        )}
      </div>

      {/* Gallery Images Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Gallery Images ({sortedGalleryImages.length})
          </h2>
          {sortedGalleryImages.length > 1 && (
            <p className="text-sm text-gray-500">
              Drag and drop to reorder gallery images
            </p>
          )}
        </div>
        
        {sortedGalleryImages.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={sortedGalleryImages.map(img => img.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {sortedGalleryImages.map((image) => (
                  <div key={image.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <SortableImageCard 
                      image={image} 
                      isDraggable={true}
                      isReordering={isReordering}
                      onDelete={() => setImageToDelete(image)}
                      vehicleId={vehicle.id}
                      processingStatus={vehicle.processingStatus}
                      onProcessingStart={handleProcessingStart}
                      onProcessingComplete={handleProcessingComplete}
                    />
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No gallery images uploaded yet</p>
          </div>
        )}
      </div>

      {/* Reordering indicator */}
      {isReordering && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Updating image order...</span>
          </div>
        </div>
      )}

      {/* Deleting indicator */}
      {isDeleting && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Deleting image...</span>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {imageToDelete && (
        <DeleteImageModal
          image={imageToDelete}
          onConfirm={() => handleDeleteImage(imageToDelete)}
          onCancel={() => setImageToDelete(null)}
        />
      )}
    </div>
  )
}

interface ImageCardProps {
  image: VehicleImage
  isDraggable: boolean
  onDelete: () => void
  vehicleId: string
  processingStatus: ProcessingStatus
  onProcessingStart: () => void
  onProcessingComplete: (updatedImage: VehicleImage) => void
}

function ImageCard({ 
  image, 
  isDraggable, 
  onDelete, 
  vehicleId, 
  processingStatus, 
  onProcessingStart, 
  onProcessingComplete 
}: ImageCardProps) {
  const getImageTypeLabel = (type: ImageType): string => {
    const labels: Record<ImageType, string> = {
      'FRONT_QUARTER': 'Front Quarter',
      'FRONT': 'Front',
      'BACK_QUARTER': 'Back Quarter', 
      'BACK': 'Back',
      'DRIVER_SIDE': 'Driver Side',
      'PASSENGER_SIDE': 'Passenger Side',
      'GALLERY': 'Gallery'
    }
    return labels[type]
  }

  return (
    <div className="group relative">
      {/* Delete button - shown on hover */}
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg"
        title="Delete image"
      >
        <TrashIcon className="h-4 w-4" />
      </button>

      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3">
        <Image
          src={image.processedUrl || image.originalUrl}
          alt={`${getImageTypeLabel(image.imageType)} view`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Processing indicator */}
        {image.isProcessed && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Processed
            </span>
          </div>
        )}
      </div>

      {/* Image info */}
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-gray-900">
          {getImageTypeLabel(image.imageType)}
        </h4>
        <p className="text-xs text-gray-500">
          Uploaded {new Date(image.uploadedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Processing controls */}
      <ProcessingButton
        image={image}
        vehicleId={vehicleId}
        processingStatus={processingStatus}
        onProcessingStart={onProcessingStart}
        onProcessingComplete={onProcessingComplete}
      />
    </div>
  )
}

interface SortableImageCardProps {
  image: VehicleImage
  isDraggable: boolean
  isReordering: boolean
  onDelete: () => void
  vehicleId: string
  processingStatus: ProcessingStatus
  onProcessingStart: () => void
  onProcessingComplete: (updatedImage: VehicleImage) => void
}

function SortableImageCard({ 
  image, 
  isDraggable, 
  isReordering, 
  onDelete, 
  vehicleId, 
  processingStatus, 
  onProcessingStart, 
  onProcessingComplete 
}: SortableImageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getImageTypeLabel = (type: ImageType): string => {
    const labels: Record<ImageType, string> = {
      'FRONT_QUARTER': 'Front Quarter',
      'FRONT': 'Front',
      'BACK_QUARTER': 'Back Quarter', 
      'BACK': 'Back',
      'DRIVER_SIDE': 'Driver Side',
      'PASSENGER_SIDE': 'Passenger Side',
      'GALLERY': 'Gallery'
    }
    return labels[type]
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? 'opacity-50' : ''} ${isReordering ? 'pointer-events-none' : ''}`}
      {...attributes}
      {...listeners}
    >
      {/* Delete button - shown on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full shadow-lg"
        title="Delete image"
      >
        <TrashIcon className="h-4 w-4" />
      </button>

      {/* Drag handle indicator */}
      {isDraggable && (
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black bg-opacity-50 text-white p-1 rounded text-xs">
            ⋮⋮
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3">
        <Image
          src={image.processedUrl || image.originalUrl}
          alt={`${getImageTypeLabel(image.imageType)} view`}
          fill
          className={`object-cover transition-transform duration-200 ${
            isDragging ? '' : 'group-hover:scale-105'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Processing indicator */}
        {image.isProcessed && (
          <div className="absolute bottom-2 left-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Processed
            </span>
          </div>
        )}
      </div>

      {/* Image info */}
      <div className="space-y-1">
        <h4 className="text-sm font-medium text-gray-900">
          {getImageTypeLabel(image.imageType)}
        </h4>
        <p className="text-xs text-gray-500">
          Uploaded {new Date(image.uploadedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Processing controls */}
      <ProcessingButton
        image={image}
        vehicleId={vehicleId}
        processingStatus={processingStatus}
        onProcessingStart={onProcessingStart}
        onProcessingComplete={onProcessingComplete}
      />
    </div>
  )
}