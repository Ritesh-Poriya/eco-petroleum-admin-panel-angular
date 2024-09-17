import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

var misc: any = {
  sidebar_mini_active: true
};

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
}
export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}
//Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    type: "link",
    icontype: "ni-chart-pie-35 text-primary"
  },
  {
    path: "/invoices",
    title: "Invoices",
    type: "link",
    icontype: "ni-single-copy-04 text-primary"
  },
  {
    path: "/reports",
    title: "Reports",
    type: "link",
    icontype: "ni-bullet-list-67 text-primary"
  },
  {
    path: "/stats",
    title: "Stats",
    type: "link",
    icontype: "ni-sound-wave text-primary"
  },
  {
    path: "/moneyCode",
    title: "Money Code",
    type: "link",
    icontype: "fas fa-dollar-sign text-primary"
  },
  {
    path: "/cards",
    title: "Cards Management",
    type: "link",
    icontype: "ni-badge text-primary"
  },
  {
    path: "/support",
    title: "Support",
    type: "link",
    icontype: "ni-support-16 text-primary"
  }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.checkRoleStaff().subscribe(data => {
        if (data['status'] == 200) {
          console.log('sidebar in');
          const newRoute = {
            path: "/clc",
            title: "CLC",
            type: "link",
            icontype: "fas fa-solid fa-calculator text-primary"
          };
          const existingRoute = ROUTES.find(route => route.path === newRoute.path);

          if (!existingRoute) {
            ROUTES.push(newRoute);
            this.menuItems = ROUTES.filter(menuItem => menuItem);
          }
        }
      }, (error) => {
        if (error.status === 401) {
          // Check if the /clc route exists and remove it if it does
          const indexToRemove = ROUTES.findIndex(route => route.path === "/clc");
          if (indexToRemove !== -1) {
            ROUTES.splice(indexToRemove, 1);
            this.menuItems = ROUTES.filter(menuItem => menuItem);
          }
        }
    });
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
  }
  onMouseEnterSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  }
  onMouseLeaveSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  }
  minimizeSidebar() {
    const sidenavToggler = document.getElementsByClassName(
      "sidenav-toggler"
    )[0];
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("g-sidenav-pinned")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }
    if (misc.sidebar_mini_active === true) {
      body.classList.remove("g-sidenav-pinned");
      body.classList.add("g-sidenav-hidden");
      sidenavToggler.classList.remove("active");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("g-sidenav-pinned");
      body.classList.remove("g-sidenav-hidden");
      sidenavToggler.classList.add("active");
      misc.sidebar_mini_active = true;
    }
  }
}
