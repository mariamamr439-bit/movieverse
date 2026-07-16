import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let errorMessage = 'Something went wrong. Please try again.';
      let errorTitle = 'Error';

      // Client-side error (network issues)
      if (err.error instanceof ErrorEvent) {
        errorMessage = 'Network error. Please check your internet connection.';
        errorTitle = 'Connection Error';
      } else {
        // Server-side errors
        switch (err.status) {
          case 0:
            errorMessage = 'Unable to connect to the server. Please check your internet connection.';
            errorTitle = 'Connection Error';
            break;
          case 400:
            errorMessage = err.error?.status_message || 'Bad request. Please check your input.';
            errorTitle = 'Bad Request';
            break;
          case 401:
            errorMessage = err.error?.status_message || 'Invalid API key. Please check your credentials.';
            errorTitle = 'Authentication Error';
            break;
          case 403:
            errorMessage = err.error?.status_message || 'You do not have permission to access this resource.';
            errorTitle = 'Access Denied';
            break;
          case 404:
            errorMessage = err.error?.status_message || 'The requested resource was not found.';
            errorTitle = 'Not Found';
            break;
          case 429:
            errorMessage = err.error?.status_message || 'Too many requests. Please wait a moment and try again.';
            errorTitle = 'Rate Limit Exceeded';
            break;
          case 500:
            errorMessage = err.error?.status_message || 'Internal server error. Please try again later.';
            errorTitle = 'Server Error';
            break;
          case 502:
          case 503:
          case 504:
            errorMessage = 'The server is currently unavailable. Please try again later.';
            errorTitle = 'Service Unavailable';
            break;
          default:
            errorMessage = err.error?.status_message || err.message || 'An unexpected error occurred.';
            errorTitle = `Error ${err.status || ''}`;
            break;
        }
      }

      // Log error for debugging
      console.error('API Error:', err);

      // Show error toast
      Swal.fire({
        icon: 'error',
        title: errorTitle,
        text: errorMessage,
        timer: 4000,
        showConfirmButton: true,
        confirmButtonColor: '#E50914',
        confirmButtonText: 'Got it',
        background: '#1A1A2E',
        color: '#FFFFFF',
        backdrop: 'rgba(0,0,0,0.6)',
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster',
        },
        customClass: {
          confirmButton: 'bg-primary hover:bg-primary-hover rounded-xl px-6 py-2.5 text-white font-semibold transition',
          popup: 'rounded-2xl border border-border',
          title: 'text-2xl font-bold',
        },
      });

      return throwError(() => err);
    })
  );
};