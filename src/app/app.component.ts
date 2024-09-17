import { Component, OnInit, HostListener } from "@angular/core";
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
} from "@angular/router";
import { SweetAlertComponent } from "./components/sweetalert/sweetalert.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  inactivityTimeout = 1800000; // 30 minutes (adjust as needed)
  inactivityTimer: any;

  constructor(private router: Router, public alertComponent: SweetAlertComponent) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
        window.scrollTo(0, 0);
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });
  }

  ngOnInit() {
    this.resetInactivityTimer();
  }

  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => this.logout(), this.inactivityTimeout);
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout() {
    if (this.isLoginPage()) {
    } else {
      console.log('User is inactive. Logging out...');
      this.router.navigate(["/login"]);
      this.alertComponent.showSwal(
        "error-response",
        "You have been logged out due to inactivity."
      ).then(() => {
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("company");
      });
    }
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:keypress', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  onUserActivity(event: Event) {
    this.resetInactivityTimer();
  }
}
