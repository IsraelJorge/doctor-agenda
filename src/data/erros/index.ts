import { ErrorCode } from './error-code'

interface AppErrorOptions {
  code: ErrorCode
  message: string
  metadata?: Record<string, unknown>
  originalError?: unknown
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly metadata?: Record<string, unknown>,
    public readonly originalError?: unknown,
  ) {
    super(message)
    this.name = 'AppError'

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      ...(this.metadata && { metadata: this.metadata }),
    }
  }
}

export function throwAppError(
  code: ErrorCode,
  message: string,
  options?: Omit<AppErrorOptions, 'code' | 'message'>,
): never {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[AppError] ${code}: ${message}`, {
      metadata: options?.metadata,
      error: options?.originalError,
    })
  }

  throw new AppError(code, message, options?.metadata, options?.originalError)
}

export const ErrorUtils = {
  unauthorized: (
    params: Partial<Omit<AppErrorOptions, 'code'>> & { message?: string } = {},
  ) => {
    const { message = 'Unauthorized access', ...options } = params
    return throwAppError('UNAUTHORIZED', message, options)
  },

  forbidden: (
    params: Partial<Omit<AppErrorOptions, 'code'>> & { message?: string } = {},
  ) => {
    const { message = 'Forbidden resource', ...options } = params
    return throwAppError('FORBIDDEN', message, options)
  },

  notFound: (
    params: Partial<Omit<AppErrorOptions, 'code'>> & { message?: string } = {},
  ) => {
    const { message = 'Resource not found', ...options } = params
    return throwAppError('NOT_FOUND', message, options)
  },

  validationError: (
    params: Partial<Omit<AppErrorOptions, 'code'>> & {
      message?: string
      metadata?: Record<string, unknown>
    } = {},
  ) => {
    const { message = 'Validation error', metadata, ...options } = params
    return throwAppError('VALIDATION_ERROR', message, { ...options, metadata })
  },

  internalError: (
    params: Partial<Omit<AppErrorOptions, 'code'>> & {
      message?: string
      originalError?: unknown
    } = {},
  ) => {
    const {
      message = 'Internal server error',
      originalError,
      ...options
    } = params
    return throwAppError('INTERNAL_SERVER_ERROR', message, {
      ...options,
      originalError,
    })
  },

  missingClinic: (
    params: Partial<Omit<AppErrorOptions, 'code'>> & { message?: string } = {},
  ) => {
    const { message = 'Clinic is required', ...options } = params
    return throwAppError('CLINIC_REQUIRED', message, options)
  },
}
