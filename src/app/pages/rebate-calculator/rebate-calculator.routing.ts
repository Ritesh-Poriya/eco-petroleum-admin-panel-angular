import { Routes } from "@angular/router";

import { RebateCalculatorComponent } from "./rebate-calculator.component";
import { RebateCalculatorResolver } from "src/app/resolvers/rebate-calculator-resolver.service";

export const RebateCalculatorRoutes: Routes = [
  {
    path: "",
    component: RebateCalculatorComponent,
    resolve: {
      data: RebateCalculatorResolver
    }
  },
];
