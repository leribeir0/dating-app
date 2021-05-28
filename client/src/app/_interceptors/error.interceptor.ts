import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(Error => {
        if (Error) {
          switch (Error.status) {
            case 400:
              if (Error.error.errors) {
                const modalStateErrors = [];
                for (const key in Error.error.errors) {
                  if (Error.error.errors[key]) {
                    modalStateErrors.push(Error.error.errors[key])
                  }
                }
                throw modalStateErrors.flat();
              } else {
                this.toastr.error(Error.statusText, Error.status);
              }
              break;
            case 401:
              this.toastr.error(Error.statusText, Error.status);
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              const navigationExtras: NavigationExtras = { state: { Error: Error.error } };
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Algo inesperado aconteceu, estamos verificando!')
              console.log(Error);
              break;
          }
        }
        return throwError(Error);
      })
    )
  }
}


