import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RebateCalculatorComponent } from './rebate-calculator.component';
import { RebateCalculatorRoutes } from './rebate-calculator.routing';
import { ComponentsModule } from 'src/app/components/components.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [RebateCalculatorComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(RebateCalculatorRoutes),
    FormsModule,
    BsDatepickerModule.forRoot()
  ],
  exports: [RebateCalculatorComponent]
})
export class RebateCalculatorModule { }
