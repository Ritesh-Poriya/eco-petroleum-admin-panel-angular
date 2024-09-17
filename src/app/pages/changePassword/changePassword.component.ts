import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { SweetAlertComponent } from "src/app/components/sweetalert/sweetalert.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "changePassword.component.html",
})
export class ChangePasswordComponent implements OnInit {
  focus;
  focus1;
  loading = false;
  loginForm: FormGroup;
  changePasswordForm: FormGroup;
  formError = "";
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private alertComponent: SweetAlertComponent
  ) {}

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      currentPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.changePasswordForm.controls;
  }

  savePassword(formBody) {
    this.spinner.show();
    this.authService
      .changePassword({
        old_password: formBody.currentPassword,
        new_password: formBody.newPassword,
      })
      .subscribe(
        (data) => {
          this.spinner.hide();
          this.alertComponent.showSwal("password-changed");
          this.formError = "";
        },
        (err) => {
          this.spinner.hide();
          try {
            console.log('Error: ', err);

            if (err.error) {
              if (err.error.detail) {
                this.formError = err.error.detail;
              } else if (err.error.new_password) {
                this.formError = "New password errors:\n" + err.error.new_password.join("\n");
              } else {
                this.formError = "Something went wrong. Please ensure the existing password is correct.";
              }
            } else {
              this.formError = "Something went wrong. Please ensure the existing password is correct.";
            }
          } catch (error) {
            this.formError = "Something went wrong. Please ensure the existing password is correct.";
          }
        }
      );
  }
}
