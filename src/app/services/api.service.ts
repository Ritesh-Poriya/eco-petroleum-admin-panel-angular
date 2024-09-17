import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class APIService {
  // TODO: Configure this URL in .env file
  hostName = environment.apiUrl;

  constructor(
    private http: HttpClient
    ) {
  }

  post(URL: string, data: object, httpOptions: object) {
    return this.http.post<any>(this.urlWithHost(URL), data, httpOptions);
  }

  get(URL: string, httpOptions: object) {
    return this.http.get<any>(this.urlWithHost(URL), httpOptions);
  }

  put(URL: string, data: object, httpOptions: object) {
    return this.http.put(this.urlWithHost(URL), data, httpOptions);
  }

  patch(URL: string, data: object, httpOptions: object) {
    return this.http.patch(this.urlWithHost(URL), data, httpOptions);
  }

  urlWithHost(URL: string): string {
    return `${this.hostName}${URL}`
  }
}
