import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser: any;

  constructor(
    private apiService: APIService
  ) {
  }

  login(company: string, password: string) {
    return this.apiService.post(`/api/v1/auth`, { company, password }, {}).pipe(
      map((user) => {
        if (user && user.token) {
          sessionStorage.setItem("currentUser", JSON.stringify(user));
        }
        return user;
      })
    );
  }

  public changePassword(body) {
    return this.apiService.put(`/api/v1/app/upass`, body, {
      headers: new HttpHeaders({
        "content-type": "application/json",
        Authorization: "token " + JSON.parse(sessionStorage.getItem('currentUser')).token,
      }),
    });
  }

  public checkRoleStaff() {
    return this.apiService.get(`/api/v1/app/checkrole_staff`, {
      headers: new HttpHeaders({
        "content-type": "application/json",
        Authorization: "token " + JSON.parse(sessionStorage.getItem('currentUser')).token,
      }),
    });
  }
}
