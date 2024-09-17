import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { InvoiceService } from "src/app/services/invoice.service";
import { saveAs } from "file-saver";
import { SweetAlertComponent } from "src/app/components/sweetalert/sweetalert.component";

declare var $: any;
@Component({
  selector: "app-invoices",
  templateUrl: "invoices.component.html",
  styleUrls: ["./invoices.component.scss"]
})
export class InvoicesComponent implements OnInit {
  company: [];
  public company_address: string;
  public company_name: string;
  public company_phone: string;
  public total_amount: string;
  public total_tax: string;
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
    private invoiceService: InvoiceService,
    private alertComponent: SweetAlertComponent,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.getInvoiceData(data["data"]);
    });
    this.start_date = new Date();
    this.start_date.setDate(this.start_date.getDate() - 7);
    this.end_date = new Date();
    this.end_date.setDate(this.end_date.getDate() - 1);
  }

  changeDate(date, type) {
    this[type] = new Date(date);;
  }

  loadFilteredInvoiceData() {
    let datePipe = new DatePipe("en-US");
    let startDate =
      datePipe.transform(this.start_date, "yyyy-MM-dd") + "T00:00:00Z";
    let endDate =
      datePipe.transform(this.end_date, "yyyy-MM-dd") + "T00:00:00Z";
    this.spinner.show();

    this.invoiceService
      .getInvoices(
        startDate,
        endDate,
        this.currency,
        this.company_filter,
        this.product
      )
      .subscribe(
        (data) => {
          this.spinner.hide();
          this.getInvoiceData(data);
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

  getInvoiceData(data) {
    this.transactions = data["data"];
    this.company_address = data["company_address"];
    this.company_name = data["company_name"];
    this.company_phone = data["company_phone"];
    this.total_amount = data["total_amount"];
    this.total_tax = data["total_tax"];
    this.total_qty = data["total_qty"];
    this.company = data["company"];
    this.companyLength = (data['company'].length === 1) ? true : false;
    if (this.company_filter === "All") {
      this.company_filter = data["company"][0].name;
    }
    this.transactions.map((item) => {
      item.card = item.card.toString().replace(/.(?=.{4})/g, "");
    });
    this.tableData = {
      headerRow: this.columnsHeading,
      dataRows: this.transactions,
    };
  }

  public downloadPDF(): void {
    let datePipe = new DatePipe("en-US");
    let startDate =
      datePipe.transform(this.start_date, "yyyy-MM-dd") + "T00:00:00Z";
    let endDate =
      datePipe.transform(this.end_date, "yyyy-MM-dd") + "T00:00:00Z";
    if (!this.company_filter) {
      this.company_filter = "All";
    }
    this.spinner.show();
    this.invoiceService
      .getInvoiceFileName(
        this.currency,
        startDate,
        endDate,
        this.company_filter,
        this.product
      )
      .subscribe(
        (fileData) => {
          let fileName = `${fileData["filename"]}`;
          this.invoiceService
            .downloadInvoice(
              this.currency,
              startDate,
              endDate,
              this.company_filter
            )
            .subscribe(
              (data) => {
                this.spinner.hide();
                saveAs(data as unknown as string, fileName);
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
}
