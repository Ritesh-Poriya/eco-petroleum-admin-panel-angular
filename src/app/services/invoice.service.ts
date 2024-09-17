import { Injectable } from "@angular/core";
import { APIService } from "./api.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class InvoiceService {
  private headers: any;
  constructor(private apiService: APIService) {
    this.headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization:
        "token " + JSON.parse(sessionStorage.getItem("currentUser")).token,
    });
  }

  public sendMoneyCodeEmail(body) {
    return this.apiService.post(
      `/send-email-mc?mc_amount=${body.mc_amount}&company_name=${body.company_name}&unit_number=${body.unit_number}&mc_reason=${body.mc_reason}&request_id=${body.request_id}&trip_number=${body.trip_number}&driver_name=${body.driver_name}`,
      {},
      { headers: this.headers }
    );
  }

  public getInvoices(
    startDate,
    endDate,
    currency = "",
    company = "",
    product = ""
  ) {
    let currencyQuery = "",
      companyQuery = "",
      productQuery = "";
    if (currency !== "") currencyQuery = `&currency=${currency}`;
    if (company !== "") companyQuery = `&company_name=${company}`;
    if (product !== "")
      productQuery = product === "diesel" ? `&item_not=MC` : `&item=${product}`;
    return this.apiService.get(
      `/api/v1/app/invoice?&date_after=${startDate}&date_before=${endDate}${currencyQuery}${companyQuery}${productQuery}`,
      { headers: this.headers }
    );
  }

  public downloadInvoice(currency, startDate, endDate, company) {
    return this.apiService.get(
      `/invoce/download?currency=${currency}&date_after=${startDate}&date_before=${endDate}&company_name=${company}`,
      {
        headers: new HttpHeaders({
          "content-type": "application/json",
          Authorization:
            "token " + JSON.parse(sessionStorage.getItem("currentUser")).token,
        }),
        responseType: "blob",
      }
    );
  }

  public getInvoiceFileName(
    currency,
    startDate,
    endDate,
    company = "",
    product = ""
  ) {
    let currencyQuery = "",
      companyQuery = "",
      productQuery = "";
    if (currency !== "") currencyQuery = `&currency=${currency}`;
    if (company !== "") companyQuery = `&company=${company}`;
    if (product !== "")
      productQuery = product === "diesel" ? `&item_not=MC` : `&item=${product}`;
    return this.apiService.get(
      `/api/v1/app/invoice_filename?currency=${currency}&date_after=${startDate}&date_before=${endDate}&company_name=${company}`,
      { headers: this.headers }
    );
  }
}
