import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const isMobileDevice = this.isMobileDevice();
    const getCookieMobileDevice = localStorage.getItem('mobile_device');
    if (isMobileDevice && !getCookieMobileDevice) {
      setTimeout(() => {
        document.body.classList.add('g-sidenav-pinned');
        document.body.classList.remove("g-sidenav-hidden");
        localStorage.setItem('mobile_device', 'true');
      }, 3000);
    }
  }

  private isMobileDevice(): boolean {
    const mobileKeywords = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return mobileKeywords.test(navigator.userAgent);
  }
}
