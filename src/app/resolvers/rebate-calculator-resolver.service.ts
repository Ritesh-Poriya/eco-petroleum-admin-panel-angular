import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { DatePipe } from "@angular/common";
import { InvoiceService } from "../services/invoice.service";

@Injectable({
  providedIn: 'root'
})
export class RebateCalculatorResolver implements Resolve<any> {

  constructor(
    private _invoiceService: InvoiceService
  ) { }

  resolve():
    Observable<any> | Promise<any> | any {
    let date = new Date().setDate(new Date().getDate() - 7);
    let yesterday_date = new Date().setDate(new Date().getDate() - 1);
    let datePipe = new DatePipe("en-US");
    let startDate = datePipe.transform(date, "yyyy-MM-dd") + "T00:00:00Z";
    let endDate =
      datePipe.transform(yesterday_date, "yyyy-MM-dd") + "T00:00:00Z";
    return this._invoiceService.getInvoices(
      startDate,
      endDate,
      "CAD",
      sessionStorage.getItem("company") ?? ""
    );
  }
}
