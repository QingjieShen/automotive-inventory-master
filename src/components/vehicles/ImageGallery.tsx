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
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
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
  const exteriorGalleryImages = vehicle.images.filter(img => img.imageType === 'GALLERY_EXTERIOR')
  const interiorGalleryImages = vehicle.images.filter(img => img.imageType === 'GALLERY_INTERIOR')
  const legacyGalleryImages = vehicle.images.filter(img => img.imageType === 'GALLERY')

  // Sort key images by type order (these don't get reordered, they have fixed positions)
  const sortedKeyImages = keyImageTypes.map(type => 
    keyImages.find(img => img.imageType === type)
  ).filter(Boolean) as VehicleImage[]

  // Sort gallery images by sortOrder for drag-and-drop
  const sortedExteriorGalleryImages = [...exteriorGalleryImages].sort((a, b) => a.sortOrder - b.sortOrder)
  const sortedInteriorGalleryImages = [...interiorGalleryImages].sort((a, b) => a.sortOrder - b.sortOrder)
  const sortedLegacyGalleryImages = [...legacyGalleryImages].sort((a, b) => a.sortOrder - b.sortOrder)

  // Get front image for the individual row
  const frontImage = sortedKeyImages.find(img => img.imageType === 'FRONT')
  const otherKeyImages = sortedKeyImages.filter(img => img.imageType !== 'FRONT')

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const activeImageId = active.id as string
    const overImageId = over.id as string

    // Find the active image
    const activeImage = vehicle.images.find(img => img.id === activeImageId)
    if (!activeImage) return

    // Find the over image (if it's an image, not a container)
    const overImage = vehicle.images.find(img => img.id === overImageId)

    // If we're dragging over another image, check if they're in the same category
    if (overImage) {
      // Same category - reorder within category
      if (activeImage.imageType === overImage.imageType) {
        let imagesToReorder: VehicleImage[] = []
        
        if (activeImage.imageType === 'GALLERY_EXTERIOR') {
          imagesToReorder = sortedExteriorGalleryImages
        } else if (activeImage.imageType === 'GALLERY_INTERIOR') {
          imagesToReorder = sortedInteriorGalleryImages
        } else if (activeImage.imageType === 'GALLERY') {
          imagesToReorder = sortedLegacyGalleryImages
        } else {
          return // Not a gallery image
        }

        const oldIndex = imagesToReorder.findIndex(img => img.id === activeImageId)
        const newIndex = imagesToReorder.findIndex(img => img.id === overImageId)

        if (oldIndex === -1 || newIndex === -1) {
          return
        }

        // Reorder the images array
        const reorderedImages = arrayMove(imagesToReorder, oldIndex, newIndex)
        
        // Update sort orders
        const updatedImages = reorderedImages.map((img, index) => ({
          ...img,
          sortOrder: index
        }))

        // Update the vehicle with new image order
        const otherImages = vehicle.images.filter(img => 
          img.imageType !== activeImage.imageType || !imagesToReorder.find(i => i.id === img.id)
        )
        
        const updatedVehicle = {
          ...vehicle,
          images: [
            ...otherImages,
            ...updatedImages
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
      } else {
        // Different category - move to the other category
        const targetCategory = overImage.imageType

        try {
          setIsReordering(true)
          
          // Update image type on server
          const response = await fetch(`/api/vehicles/${vehicle.id}/images/${activeImage.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageType: targetCategory
            }),
          })

          if (!response.ok) {
            throw new Error('Failed to update image category')
          }

          // Refresh vehicle data
          const vehicleResponse = await fetch(`/api/vehicles/${vehicle.id}`)
          if (vehicleResponse.ok) {
            const refreshedVehicle = await vehicleResponse.json()
            onVehicleUpdate(refreshedVehicle)
          }
        } catch (error) {
          console.error('Error updating image category:', error)
        } finally {
          setIsReordering(false)
        }
      }
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
    <div className="space-y-6 sm:space-y-8">
      {/* Key Images Section */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Key Images</h2>
        
        {/* Front shot in individual row */}
        {frontImage && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Front Shot</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
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

        {/* Other 5 key shots in responsive grid */}
        {otherKeyImages.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Other Key Shots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {otherKeyImages.map((image) => (
                <div key={image.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
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
          <div 
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 text-center"
            role="region"
            aria-label="No key images"
          >
            <PhotoIcon className="h-10 sm:h-12 w-10 sm:w-12 text-gray-400 mx-auto mb-4" aria-hidden="true" />
            <p className="text-gray-500">No key images uploaded yet</p>
          </div>
        )}
      </div>

      {/* Gallery Images Section */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          Gallery Images ({sortedExteriorGalleryImages.length + sortedInteriorGalleryImages.length + sortedLegacyGalleryImages.length})
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Drag images between categories to reclassify, or within a category to reorder
        </p>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-6">
            {/* Exterior Gallery Images */}
            <GalleryCategory
              title="Exterior Images"
              images={sortedExteriorGalleryImages}
              containerId="exterior-gallery-container"
              vehicle={vehicle}
              isReordering={isReordering}
              onDelete={setImageToDelete}
              processingStatus={vehicle.processingStatus}
              onProcessingStart={handleProcessingStart}
              onProcessingComplete={handleProcessingComplete}
            />

            {/* Interior Gallery Images */}
            <GalleryCategory
              title="Interior Images"
              images={sortedInteriorGalleryImages}
              containerId="interior-gallery-container"
              vehicle={vehicle}
              isReordering={isReordering}
              onDelete={setImageToDelete}
              processingStatus={vehicle.processingStatus}
              onProcessingStart={handleProcessingStart}
              onProcessingComplete={handleProcessingComplete}
            />

            {/* Legacy Gallery Images (for backward compatibility) */}
            {sortedLegacyGalleryImages.length > 0 && (
              <GalleryCategory
                title="Gallery Images (Uncategorized)"
                images={sortedLegacyGalleryImages}
                containerId="legacy-gallery-container"
                vehicle={vehicle}
                isReordering={isReordering}
                onDelete={setImageToDelete}
                processingStatus={vehicle.processingStatus}
                onProcessingStart={handleProcessingStart}
                onProcessingComplete={handleProcessingComplete}
              />
            )}
          </div>
        </DndContext>
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

interface GalleryCategoryProps {
  title: string
  images: VehicleImage[]
  containerId: string
  vehicle: Vehicle
  isReordering: boolean
  onDelete: (image: VehicleImage) => void
  processingStatus: ProcessingStatus
  onProcessingStart: () => void
  onProcessingComplete: (updatedImage: VehicleImage) => void
}

function GalleryCategory({
  title,
  images,
  containerId,
  vehicle,
  isReordering,
  onDelete,
  processingStatus,
  onProcessingStart,
  onProcessingComplete,
}: GalleryCategoryProps) {
  return (
    <div
      id={containerId}
      className="bg-white border-2 rounded-lg p-4 transition-colors border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-600">{images.length} images</span>
      </div>

      {/* Images Grid */}
      {images.length > 0 ? (
        <SortableContext 
          items={images.map(img => img.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            role="grid"
            aria-label={title}
          >
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                <SortableImageCard 
                  image={image} 
                  isDraggable={true}
                  isReordering={isReordering}
                  onDelete={() => onDelete(image)}
                  vehicleId={vehicle.id}
                  processingStatus={processingStatus}
                  onProcessingStart={onProcessingStart}
                  onProcessingComplete={onProcessingComplete}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      ) : (
        <div 
          className="text-center py-8 text-gray-500 text-sm"
          role="region"
          aria-label={`No ${title.toLowerCase()}`}
        >
          <PhotoIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" aria-hidden="true" />
          <p>No {title.toLowerCase()} yet</p>
        </div>
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
      'GALLERY': 'Gallery',
      'GALLERY_EXTERIOR': 'Exterior',
      'GALLERY_INTERIOR': 'Interior'
    }
    return labels[type]
  }

  return (
    <div className="group relative">
      {/* Delete button - shown on hover */}
      <button
        onClick={onDelete}
        className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-1 sm:p-1.5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        title="Delete image"
        aria-label={`Delete ${getImageTypeLabel(image.imageType)} image`}
      >
        <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>

      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-2 sm:mb-3">
        <Image
          src={image.processedUrl || image.originalUrl}
          alt={`${getImageTypeLabel(image.imageType)} view`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Processing indicator */}
        {image.isProcessed && (
          <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
      'GALLERY': 'Gallery',
      'GALLERY_EXTERIOR': 'Exterior',
      'GALLERY_INTERIOR': 'Interior'
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
        className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 hover:bg-red-700 text-white p-1 sm:p-1.5 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        title="Delete image"
        aria-label={`Delete ${getImageTypeLabel(image.imageType)} image`}
      >
        <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>

      {/* Drag handle indicator */}
      {isDraggable && (
        <div className="absolute top-1 sm:top-2 left-1 sm:left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div 
            className="bg-black bg-opacity-50 text-white p-1 rounded text-xs cursor-grab active:cursor-grabbing"
            aria-label="Drag to reorder"
          >
            ⋮⋮
          </div>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-2 sm:mb-3">
        <Image
          src={image.processedUrl || image.originalUrl}
          alt={`${getImageTypeLabel(image.imageType)} view`}
          fill
          className={`object-cover transition-transform duration-200 ${
            isDragging ? '' : 'group-hover:scale-105'
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        
        {/* Processing indicator */}
        {image.isProcessed && (
          <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2">
            <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
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