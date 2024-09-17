import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

import { ModalModule } from 'ngx-bootstrap/modal';
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

import { ChangePasswordComponent } from "./changePassword.component";

import { RouterModule } from "@angular/router";
import { ChangePasswordsRoutes } from "./changePassword.routing";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    ModalModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forChild(ChangePasswordsRoutes),
    ReactiveFormsModule
  ],
  exports: [ChangePasswordComponent]
})
export class ChangePasswordsModule {}
