import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

import { ReportsComponent } from "./reports.component";
import { RouterModule } from "@angular/router";
import { ReportsRoutes } from "./reports.routing";
import { FormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";


@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(ReportsRoutes),
    BsDatepickerModule.forRoot(),
    FormsModule
  ],
  exports: [ReportsComponent]
})
export class ReportsModule {}
