import axios from 'axios';
import type { ApiError } from '../types';

/** Pulls the human-readable message out of an axios/backend error. */
export const getErrorMessage = (err: unknown, fallback = 'Algo salió mal'): string => {
  if (axios.isAxiosError<ApiError>(err)) {
    return err.response?.data?.error ?? err.message ?? fallback;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return fallback;
};
