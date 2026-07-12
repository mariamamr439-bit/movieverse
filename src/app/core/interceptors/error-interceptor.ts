import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      let errorMessage = 'Something went wrong';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = 'Bad request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please check your API key.';
            break;
          case 403:
            errorMessage = 'Forbidden. You do not have permission.';
            break;
          case 404:
            errorMessage = 'Resource not found.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please try again later.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          default:
            errorMessage = error.message || 'An unexpected error occurred.';
        }
      }

      // Show error toast
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        timer: 4000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        background: '#0f172a',
        color: '#f8fafc',
      });

      console.error('API Error:', error);
      return throwError(() => error);
    })
  );
};