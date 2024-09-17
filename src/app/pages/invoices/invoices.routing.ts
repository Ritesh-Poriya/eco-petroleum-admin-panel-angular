import { Routes } from "@angular/router";

import { InvoicesComponent } from "./invoices.component";
import { InvoiceResolverService } from "src/app/resolvers/invoice-resolver.service";

export const InvoicesRoutes: Routes = [
  {
    path: "",
    component: InvoicesComponent,
    resolve: {
      data: InvoiceResolverService,
    },
  },
];
