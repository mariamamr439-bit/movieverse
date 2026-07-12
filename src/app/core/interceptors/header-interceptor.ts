import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  // Add API key to all requests
  const authReq = req.clone({
    params: req.params.set('api_key', environment.tmdbApiKey)
  });
  
  return next(authReq);
};