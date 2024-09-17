import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

import { MoneyCodeComponent } from "./moneyCode.component";
import { RouterModule } from "@angular/router";
import { MoneyCodeRoutes } from "./moneyCode.routing";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [MoneyCodeComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(MoneyCodeRoutes),
    FormsModule,
  ],
  exports: [MoneyCodeComponent]
})
export class MoneyCodeModule {}
