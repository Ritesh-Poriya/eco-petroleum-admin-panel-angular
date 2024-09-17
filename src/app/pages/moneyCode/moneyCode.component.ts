import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SweetAlertComponent } from "src/app/components/sweetalert/sweetalert.component";
import { InvoiceService } from "src/app/services/invoice.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "moneyCode.component.html",
})
export class MoneyCodeComponent implements OnInit {
  moneyCode: any;
  public transactions;
  error: string;
  company: [];
  public company_filter: any = sessionStorage.getItem("company") ?? "All";
  public companyLength;

  constructor(
    private activatedRoute: ActivatedRoute,
    public invoiceService: InvoiceService,
    private spinner: NgxSpinnerService,
    private alertComponent: SweetAlertComponent
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.getTransactionsData(data["data"]);
    });
    this.moneyCode = {
      mc_amount: "",
      unit_number: "",
      card_number: "",
      mc_reason: "",
      trip_number: "",
      driver_name: "",
    };
  }

  getTransactionsData(data) {
    this.transactions = data["transactions"];
    this.company = data["companies"];
    this.companyLength = (data['companies'].length === 1) ? true : false;
    if (this.company_filter === "All") {
      this.company_filter = data["companies"][0].name;
    }
  }

  onSubmit(value, isValid: boolean, form: NgForm) {
    if (isValid) {
      let requestId = Math.floor(100000 + Math.random() * 900000);
      const body = {
        ...value,
        company_name: this.company_filter,
        request_id: requestId,
      };
      this.spinner.show();
      this.invoiceService.sendMoneyCodeEmail(body).subscribe(
        (data) => {
          this.spinner.hide();
          const title = "Thank you!";
          const message = `Your request is in progress. Please note the confirmation number: ${requestId} . Money code will be forwarded to email.`;
          this.alertComponent.showSwal("success-message", title, message);
          this.onReset(form);
          this.company_filter = sessionStorage.getItem("company") ?? "All"
        },
        (error) => {
          if (error.status !== 404) {
            this.alertComponent.showSwal(
              "error-response",
              "An internal error occurred while processing your request. Our team has been notified and will look into the issue. Please try again later or contact support@ecopetroleum.ca"
            );
          } else {
            this.alertComponent.showSwal(
              "error-response",
              "Something went wrong, please try again later. For urgencies contact; support@ecopetroleum.ca"
            );
          }
          this.spinner.hide();
        }
      );
    }
  }

  onReset(form) {
    console.log('form');

    form.resetForm();
    this.spinner.hide();
  }
}
