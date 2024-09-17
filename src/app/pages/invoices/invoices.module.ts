import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { InvoicesComponent } from "./invoices.component";
import { RouterModule } from "@angular/router";
import { InvoicesRoutes } from "./invoices.routing";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [InvoicesComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(InvoicesRoutes),
    FormsModule,
    BsDatepickerModule.forRoot()
  ],
  exports: [InvoicesComponent],
})
export class InvoicesModule {}
