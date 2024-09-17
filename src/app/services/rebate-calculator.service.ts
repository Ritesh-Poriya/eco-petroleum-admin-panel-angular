import { Injectable } from "@angular/core";
import { APIService } from "./api.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class RebateCalculatorService {
  private headers: any;
  constructor(private apiService: APIService) {
    this.headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization:
        "token " + JSON.parse(sessionStorage.getItem("currentUser")).token,
    });
  }

  public getCLC(startDate, endDate, currency = "", company = "") {
    let currencyQuery = "", companyQuery = "";
    if (currency !== "") currencyQuery = `&currency=${currency}`;
    if (company !== "") companyQuery = `&company_name=${company}`;
    return this.apiService.get(
      `/api/v1/app/crebates?&date_after=${startDate}&date_before=${endDate}${currencyQuery}${companyQuery}`,
      { headers: this.headers }
    );
  }
}
