import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { CardsComponent } from "./cards.component";
import { RouterModule } from "@angular/router";
import { CardsRoutes } from "./cards.routing";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { CardMaskPipePipe } from "./card-mask-pipe.pipe";

@NgModule({
  declarations: [CardsComponent, CardMaskPipePipe,],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(CardsRoutes),
    MatSlideToggleModule,
    NgxDatatableModule,
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  exports: [CardsComponent],
})
export class CardsModule {}
