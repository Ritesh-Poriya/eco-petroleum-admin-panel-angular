import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { TransactionService } from "../services/transaction.service";
import { setEndDate, setStartDate } from "../helpers/utils";

@Injectable({
  providedIn: "root",
})
export class StatsResolverService implements Resolve<any> {
  constructor(private _transactionService: TransactionService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    let startDate = setStartDate(new Date().setDate(new Date().getDate() - 30));
    let endDate = setEndDate(new Date().setDate(new Date().getDate() - 1));
    return this._transactionService.getTransactions(startDate, endDate, "", sessionStorage.getItem("company") ?? "");
  }
}
