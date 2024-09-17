import { Routes } from "@angular/router";

import { MoneyCodeComponent } from "./moneyCode.component";
import { TransactionResolverService } from "src/app/resolvers/transaction-resolver.service";

export const MoneyCodeRoutes: Routes = [
  {
    path: "",
    component: MoneyCodeComponent,
    resolve: {
      data: TransactionResolverService,
    },
  }
];
