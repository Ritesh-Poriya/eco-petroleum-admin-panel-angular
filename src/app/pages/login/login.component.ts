import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: "app-login",
  templateUrl: "login.component.html"
})
export class LoginComponent implements OnInit {
  focus;
  focus1;
  loading = false;
  loginForm: FormGroup;
  form: FormGroup;
  formError = ""
  private formSubmitAttempt: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-default");

    this.form = this.fb.group({
      company: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-default");
  }

  // convenience getter for easy access to form fields
  get f() { return this.form.controls; }

  onSubmit() {
    this.spinner.show();
    console.log(this.form.valid)
    if (this.form.valid) {
      this.formError = '';
      this.authService.login(this.form.value.company, this.form.value.password)
        .pipe()
        .subscribe(
          data => {
            this.spinner.hide();
            sessionStorage.setItem('company', this.form.value.company)
            this.router.navigate(['/dashboard']);
          },
          error => {
            this.spinner.hide();
            this.formError = 'Invalid Username or Password. Please try again with right credentials.';
          }
        )
    } else {
      this.spinner.hide();
      this.formError = "Please enter credentials."
    }
    this.formSubmitAttempt = true;
  }
}
