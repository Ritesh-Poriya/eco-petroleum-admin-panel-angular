import { Injectable } from "@angular/core";
import { APIService } from "./api.service";
import { HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class CardsService {
  private headers: any;
  constructor(private apiService: APIService) {
    this.headers = new HttpHeaders({
      "content-type": "application/json",
      Authorization:
        "token " + JSON.parse(sessionStorage.getItem("currentUser")).token,
    });
  }

  public getCards(cardNumber = "") {
    return this.apiService.get(`/api/v1/app/card?card=${cardNumber}`, {
      headers: this.headers,
    });
  }

  public updateCards(body) {
    return this.apiService.patch(`/api/v1/app/card_update`, body, {
      headers: this.headers,
    });
  }

  // public downloadCard() {
  //   return this.apiService.get(
  //     `/invoce/download?card=${currency}&unit=${startDate}&drivername=${endDate}&status=${company}`,
  //     {
  //       headers: new HttpHeaders({
  //         "content-type": "application/json",
  //         Authorization:
  //           "token " + JSON.parse(sessionStorage.getItem("currentUser")).token,
  //       }),
  //       responseType: "blob",
  //     }
  //   );
  // }

  // public getCardFileName(
  //   currency,
  //   startDate,
  //   endDate,
  //   company = "",
  //   product = ""
  // ) {
  //   let currencyQuery = "",
  //     companyQuery = "",
  //     productQuery = "";
  //   if (currency !== "") currencyQuery = `&currency=${currency}`;
  //   if (company !== "") companyQuery = `&company=${company}`;
  //   if (product !== "")
  //     productQuery = product === "diesel" ? `&item_not=MC` : `&item=${product}`;
  //   return this.apiService.get(
  //     `/api/v1/app/invoice_filename?currency=${currency}&date_after=${startDate}&date_before=${endDate}&company_name=${company}`,
  //     { headers: this.headers }
  //   );
  // }
}
