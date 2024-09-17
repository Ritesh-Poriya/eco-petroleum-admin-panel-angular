import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";

import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./pages/login/login.component";
import { AuthGuard } from "./services/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "",
    component: AdminLayoutComponent,
    children: [
      {
        path: "dashboard",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./pages/dashboards/dashboards.module").then(
            (m) => m.DashboardsModule
          ),
      },
      {
        path: "change-password",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./pages/changePassword/changePassword.module").then(
            (m) => m.ChangePasswordsModule
          ),
      },
      {
        path: "invoices",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./pages/invoices/invoices.module").then(
            (m) => m.InvoicesModule
          ),
      },
      {
        path: "reports",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./pages/reports/reports.module").then((m) => m.ReportsModule),
      },
      {
        path: "stats",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./pages/stats/stats.module").then((m) => m.StatsModule),
      },
      {
        path: "moneyCode",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./pages/moneyCode/moneyCode.module").then(
            (m) => m.MoneyCodeModule
          ),
      },
      {
        path: "cards",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./pages/cards/cards.module").then((m) => m.CardsModule),
      },
      {
        path: "support",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./pages/support/support.module").then((m) => m.SupportModule),
      },
      {
        path: "clc",
        canActivate: [AuthGuard],
        loadChildren: () =>
          import("./pages//rebate-calculator/rebate-calculator.module").then(
            (m) => m.RebateCalculatorModule
          ),
      },
    ],
  },
  {
    path: "**",
    redirectTo: "login",
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
