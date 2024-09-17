import { Injectable } from "@angular/core";
import { APIService } from "./api.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class TransactionService {
  private headers: any;
  constructor(private apiService: APIService) {
    this.headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization:
        "token " + JSON.parse(sessionStorage.getItem("currentUser")).token,
    });
  }

  public getTransactions(
    startDate,
    endDate,
    currency = "",
    company = "",
    product = "",
    card = "",
    city = "",
    unit = ""
  ) {
    let currencyQuery = "",
      companyQuery = "",
      productQuery = "",
      cardQuery = "",
      cityQuery = "",
      unitQuery = "";
    if (currency !== "") currencyQuery = `&currency=${currency}`;
    if (company !== "") companyQuery = `&company=${company}`;
    if (card !== "") cardQuery = `&card=${card}`;
    if (city !== "") cityQuery = `&city=${city}`;
    if (unit !== "") unitQuery = `&unit=${unit}`;
    if (product !== "")
      productQuery = product === "diesel" ? `&item_not=MC` : `&item=${product}`;
    return this.apiService.get(
      `/api/v1/app/trans?&date_after=${startDate}&date_before=${endDate}${currencyQuery}${companyQuery}${productQuery}${cardQuery}${cityQuery}${unitQuery}&format=json`,
      { headers: this.headers }
    );
  }

  public downloadReport(
    startDate,
    endDate,
    currency,
    card,
    city,
    unit,
    product,
    company,
    export_template,
    format
  ) {
    let currencyQuery = "",
      companyQuery = "",
      productQuery = "",
      cardQuery = "",
      cityQuery = "",
      unitQuery = "";
    if (currency !== "") currencyQuery = `&currency=${currency}`;
    if (company !== "") companyQuery = `&company=${company}`;
    if (card !== "") cardQuery = `&card=${card}`;
    if (city !== "") cityQuery = `&city=${city}`;
    if (unit !== "") unitQuery = `&unit=${unit}`;
    if (product !== "")
      productQuery = product === "diesel" ? `&item_not=MC` : `&item=${product}`;
    return this.apiService.get(
      `/api/v1/app/trans?&date_after=${startDate}&date_before=${endDate}${currencyQuery}${companyQuery}${productQuery}${cardQuery}${cityQuery}${unitQuery}&export_format=${format}&export_template=${export_template}`,
      {
        headers: new HttpHeaders({
          "content-type": "application/json",
          Authorization:
            "token " + JSON.parse(sessionStorage.getItem("currentUser")).token
        }),
        responseType: "blob",
      }
    );
  }

  public createTemplate(body) {
    return this.apiService.post(`/api/v1/app/trans`, body, {
      headers: this.headers,
    });
  }
}
