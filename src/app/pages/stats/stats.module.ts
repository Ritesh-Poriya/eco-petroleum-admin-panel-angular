import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

import { StatsComponent } from "./stats.component";
import { RouterModule } from "@angular/router";
import { StatsRoutes } from "./stats.routing";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

@NgModule({
  declarations: [StatsComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(StatsRoutes),
    BsDatepickerModule.forRoot(),
  ],
  exports: [StatsComponent],
})
export class StatsModule {}
