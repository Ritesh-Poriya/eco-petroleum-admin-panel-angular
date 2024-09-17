import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SweetAlertComponent } from "src/app/components/sweetalert/sweetalert.component";
import { RebateCalculatorService } from "src/app/services/rebate-calculator.service";

@Component({
  selector: "app-rebate-calculator",
  templateUrl: "rebate-calculator.component.html",
  styleUrls: ["./rebate-calculator.component.scss"]
})
export class RebateCalculatorComponent implements OnInit {
  company: [];
  public company_contact: string;
  public company_name: string;
  public company_email: string;
  public total_discount: string;
  public eco_avg_cost: string;
  public customer_avg_rebate: string;
  public total_qty: string;
  public tableData: any;
  public transactions;
  public start_date: Date;
  public end_date: Date;
  public company_filter: any = "All";
  public companyLength;
  public currency: any = "CAD";
  public product: any = "";
  public columnsHeading = [
    "Company Id",
    "Transaction Date",
    "Card",
    "City",
    "Unit",
    "State",
    "Disc Ppu",
    "Quantity",
    "Amount",
    "Currency",
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private clcService: RebateCalculatorService,
    private alertComponent: SweetAlertComponent,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.getRebateCalculatorData(data["data"]);
    });
    this.start_date = new Date();
    this.start_date.setDate(this.start_date.getDate() - 7);
    this.end_date = new Date();
    this.end_date.setDate(this.end_date.getDate() - 1);
  }

  changeDate(date, type) {
    this[type] = new Date(date);;
  }

  loadFilteredRebateCalculatorData() {
    let datePipe = new DatePipe("en-US");
    let startDate =
      datePipe.transform(this.start_date, "yyyy-MM-dd") + "T00:00:00Z";
    let endDate =
      datePipe.transform(this.end_date, "yyyy-MM-dd") + "T00:00:00Z";
    this.spinner.show();

    this.clcService
      .getCLC(
        startDate,
        endDate,
        this.currency,
        this.company_filter,
      )
      .subscribe(
        (data) => {
          this.spinner.hide();
          this.getRebateCalculatorData(data);
        },
        (error) => {
          if (error.status === 401) {
            this.alertComponent.showSwal(
              "error-response",
              "Your token is expired. Please login again"
            ).then(() => {
              sessionStorage.removeItem("currentUser");
              sessionStorage.removeItem("company");
              this.router.navigate(["/login"]);
            });
          } else if (error.status !== 404) {
            this.alertComponent.showSwal(
              "error-response",
              "An internal error occurred while processing your request. Our team has been notified and will look into the issue. Please try again later or contact support@ecopetroleum.ca"
            );
          }
          this.spinner.hide();
        }
      );
  }


  getRebateCalculatorData(data) {
    if (typeof data['data'] != 'string') {
      this.transactions = data["data"];
      this.company_contact = data["company_contact"];
      this.company_name = data["company_name"];
      this.company_email = data["company_email"];
      this.total_discount = data["total_discount"];
      this.eco_avg_cost = data["eco_avg_cost"];
      this.customer_avg_rebate = data["customer_avg_rebate"];
      this.total_qty = data["total_qty"];
      this.company = data["company"];
      this.companyLength = (data['company'].length === 1) ? true : false;
      if (this.company_filter === "All") {
        this.company_filter = data["company"][0].name;
      }
      this.transactions.map((item) => {
        item.card = item.card.toString().replace(/.(?=.{4})/g, "");
      });
    } else {
      this.transactions = [];
    }

    this.tableData = {
      headerRow: this.columnsHeading,
      dataRows: this.transactions,
    };
  }
}
