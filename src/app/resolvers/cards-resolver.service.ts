import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { CardsService } from "../services/cards.service";

@Injectable({
  providedIn: "root",
})
export class CardsResolverService implements Resolve<any> {
  constructor(private _cardService: CardsService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    let page = route.params["page"];
    if (page == undefined) {
      page = 1;
    }
    return this._cardService.getCards();
  }
}
