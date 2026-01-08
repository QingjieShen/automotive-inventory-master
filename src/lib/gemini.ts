import { ProcessingJob, JobStatus } from '@/generated/prisma'

export interface GeminiProcessingRequest {
  imageUrl: string
  targetBackground: string
  vehicleId: string
  imageId: string
}

export interface GeminiProcessingResponse {
  success: boolean
  processedImageUrl?: string
  error?: string
  jobId: string
}

export interface ProcessingJobData {
  id: string
  vehicleId: string
  imageIds: string[]
  status: JobStatus
  errorMessage?: string
  createdAt: Date
  completedAt?: Date
}

class GeminiAPIClient {
  private apiKey: string
  private apiUrl: string

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || ''
    this.apiUrl = process.env.GEMINI_API_URL || 'https://api.gemini.com/v1'
    
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required')
    }
  }

  /**
   * Process a single image with background removal
   */
  async processImage(request: GeminiProcessingRequest): Promise<GeminiProcessingResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/background-removal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: request.imageUrl,
          target_background: request.targetBackground,
          vehicle_id: request.vehicleId,
          image_id: request.imageId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Gemini API error: ${response.status} - ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        processedImageUrl: data.processed_image_url,
        jobId: data.job_id || `gemini_${Date.now()}`,
      }
    } catch (error) {
      console.error('Gemini API processing error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown processing error',
        jobId: `failed_${Date.now()}`,
      }
    }
  }

  /**
   * Check the status of a processing job
   */
  async checkJobStatus(jobId: string): Promise<{
    status: JobStatus
    processedImageUrl?: string
    error?: string
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/jobs/${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to check job status: ${response.status}`)
      }

      const data = await response.json()
      
      // Map Gemini API status to our JobStatus enum
      let status: JobStatus
      switch (data.status?.toLowerCase()) {
        case 'queued':
        case 'pending':
          status = JobStatus.QUEUED
          break
        case 'processing':
        case 'in_progress':
          status = JobStatus.PROCESSING
          break
        case 'completed':
        case 'finished':
          status = JobStatus.COMPLETED
          break
        case 'failed':
        case 'error':
          status = JobStatus.FAILED
          break
        default:
          status = JobStatus.QUEUED
      }

      return {
        status,
        processedImageUrl: data.processed_image_url,
        error: data.error_message,
      }
    } catch (error) {
      console.error('Error checking job status:', error)
      return {
        status: JobStatus.FAILED,
        error: error instanceof Error ? error.message : 'Failed to check job status',
      }
    }
  }

  /**
   * Process multiple images in batch
   */
  async processBatch(requests: GeminiProcessingRequest[]): Promise<GeminiProcessingResponse[]> {
    try {
      const response = await fetch(`${this.apiUrl}/background-removal/batch`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: requests.map(req => ({
            image_url: req.imageUrl,
            target_background: req.targetBackground,
            vehicle_id: req.vehicleId,
            image_id: req.imageId,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Gemini batch API error: ${response.status} - ${errorData.message || response.statusText}`)
      }

      const data = await response.json()
      
      return data.results?.map((result: any, index: number) => ({
        success: result.success || false,
        processedImageUrl: result.processed_image_url,
        error: result.error,
        jobId: result.job_id || `batch_${Date.now()}_${index}`,
      })) || []
    } catch (error) {
      console.error('Gemini batch processing error:', error)
      // Return failed responses for all requests
      return requests.map((_, index) => ({
        success: false,
        error: error instanceof Error ? error.message : 'Batch processing failed',
        jobId: `failed_batch_${Date.now()}_${index}`,
      }))
    }
  }
}

// Export singleton instance
export const geminiClient = new GeminiAPIClient()

// Default target background for consistent processing
export const DEFAULT_TARGET_BACKGROUND = 'white_studio_background'