import { HttpInterceptorFn } from '@angular/common/http';

// Send the httpOnly auth cookie on every request. The backend issues a JWT as a
// cookie, so `withCredentials` is what keeps the user authenticated (no Bearer header).
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({ withCredentials: true });
  return next(authReq);
};
