import { Injectable } from "@angular/core";
import { APIService } from "./api.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CommonAPIService {
  private headers: any;
  constructor(private apiService: APIService) {
    this.headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization:
        "token " + JSON.parse(sessionStorage.getItem("currentUser")).token,
    });
  }

  public sendSupportEmail(body) {
    return this.apiService.post(`/send-email`, body, { headers: this.headers });
  }
}
