import { Routes } from "@angular/router";

import { ReportsComponent } from "./reports.component";
import { TransactionResolverService } from "src/app/resolvers/transaction-resolver.service";

export const ReportsRoutes: Routes = [
  {
    path: "",
    component: ReportsComponent,
    resolve: {
      data: TransactionResolverService,
    },
  },
];
