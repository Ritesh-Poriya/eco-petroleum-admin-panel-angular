import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Injectable()
export class CustomInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the token from session storage or wherever you store it
    const token = JSON.parse(sessionStorage.getItem("currentUser"))?.token;

    if (token) {
      // Clone the request and set the Authorization header with the token
      request = request.clone({
        setHeaders: {
          Authorization: `token ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
