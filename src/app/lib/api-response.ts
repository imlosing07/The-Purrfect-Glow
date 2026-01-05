// src/lib/api-response.ts
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Array<{
      path: string;
      message: string;
    }>;
  }
  
export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  };
}
  
export function createErrorResponse(message: string, errors?: Array<{path: string, message: string}>): ApiResponse<null> {
  return {
    success: false,
    message,
    errors
  };
}