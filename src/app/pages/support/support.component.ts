import { Component, OnInit } from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { SweetAlertComponent } from "src/app/components/sweetalert/sweetalert.component";
import { CommonAPIService } from "src/app/services/commonAPI.service";

@Component({
  selector: "app-support",
  templateUrl: "support.component.html",
})
export class SupportComponent implements OnInit {
  support: any;
  formGroup: FormGroup;
  public error;
  constructor(
    private alertComponent: SweetAlertComponent,
    private spinner: NgxSpinnerService,
    private commonAPIService: CommonAPIService
  ) {}

  ngOnInit() {
    this.support = {
      subject: "",
      message: "",
    };
  }

  public onSubmit(value, isValid: boolean, form: NgForm): void {
    if (isValid) {
      this.spinner.show();
      this.commonAPIService.sendSupportEmail(value).subscribe(
        () => {
          this.spinner.hide();
          const title = "Thank you!";
          const message =
            "Thanks for reaching out. One of the Agent from Customer Service team will get back on your request.";

          this.alertComponent.showSwal("success-message", title, message);
          form.resetForm();
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
}
