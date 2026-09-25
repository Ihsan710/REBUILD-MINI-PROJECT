import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  const token = localStorage.getItem('rebuild_token');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        toast.warning('Session Expired', 'Please sign in to verify your credentials.');
        localStorage.removeItem('rebuild_user');
        localStorage.removeItem('rebuild_token');
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        toast.error('Permission Denied', error.error?.error || 'You do not have access to this resource.');
      } else if (error.status === 429) {
        toast.error('Security Alert', 'Too many requests. Rate limit active.');
      }
      return throwError(() => error);
    })
  );
};
