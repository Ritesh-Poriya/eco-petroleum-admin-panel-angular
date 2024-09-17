import { Routes } from "@angular/router";

import { StatsComponent } from "./stats.component";
import { StatsResolverService } from "src/app/resolvers/stats-resolver.service";

export const StatsRoutes: Routes = [
  {
    path: "",
    component: StatsComponent,
    resolve: {
      data: StatsResolverService,
    },
  },
];
