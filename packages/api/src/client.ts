import type { AxiosError, AxiosRequestConfig } from "axios"
import { create, isAxiosError } from "axios"

interface ViteImportMeta {
  url?: string
  env?: { VITE_API_BASE_URL?: string }
}

export const AXIOS_INSTANCE = create({
  baseURL: (import.meta as ViteImportMeta).env?.VITE_API_BASE_URL ?? "",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
})

export interface ApiErrorBody {
  error: { code: string; message: string }
}

export class ApiError extends Error {
  public code: string
  public status: number
  constructor(code: string, status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.code = code
    this.status = status
  }
  static fromAxios(error: AxiosError<ApiErrorBody>): ApiError {
    const status = error.response?.status ?? 0
    const body = error.response?.data?.error
    return new ApiError(body?.code ?? "NETWORK", status, body?.message ?? error.message)
  }
}

export const customAxios = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const res = await AXIOS_INSTANCE<T>({ ...config })
    return res.data
  } catch (error: unknown) {
    if (isAxiosError<ApiErrorBody>(error)) {
      throw ApiError.fromAxios(error)
    }
    throw new ApiError("NETWORK", 0, error instanceof Error ? error.message : String(error))
  }
}
