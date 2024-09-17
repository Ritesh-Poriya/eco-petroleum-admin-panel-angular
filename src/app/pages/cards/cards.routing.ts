import { Routes } from "@angular/router";

import { CardsComponent } from "./cards.component";
import { CardsResolverService } from "src/app/resolvers/cards-resolver.service";

export const CardsRoutes: Routes = [
  {
    path: "",
    component: CardsComponent,
    resolve: {
      data: CardsResolverService,
    },
  },
];
