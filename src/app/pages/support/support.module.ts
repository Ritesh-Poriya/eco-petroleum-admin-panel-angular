import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

import { SupportComponent } from "./support.component";
import { RouterModule } from "@angular/router";
import { SupportRoutes } from "./support.routing";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [SupportComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(SupportRoutes),
    FormsModule,
  ],
  exports: [SupportComponent],
})
export class SupportModule {}
