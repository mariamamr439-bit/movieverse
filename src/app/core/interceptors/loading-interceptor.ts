import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Skip loading for specific requests (optional)
  const skipLoading = req.headers.has('X-Skip-Loading');
  if (skipLoading) {
    const newReq = req.clone({
      headers: req.headers.delete('X-Skip-Loading'),
    });
    return next(newReq);
  }

  loadingService.show();

  return next(req).pipe(
    finalize(() => {
      loadingService.hide();
    })
  );
};