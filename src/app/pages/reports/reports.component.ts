import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { SweetAlertComponent } from "src/app/components/sweetalert/sweetalert.component";
import { saveAs } from "file-saver";
import { TransactionService } from "src/app/services/transaction.service";
import { CreateTemplateComponent } from "src/app/components/create-template/create-template.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-reports",
  templateUrl: "reports.component.html",
})
export class ReportsComponent implements OnInit {
  company: [];
  public tableData: any;
  public transactions;
  public start_date: Date;
  public end_date: Date;
  public company_filter: any = "All";
  public companyLength;
  public currency: any = "CAD";
  public product: any = "";
  public card = "";
  public city = "";
  public unit = "";
  public format = "";
  public template = "";
  public templates = [];
  public fields = [];
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
    private transactionService: TransactionService,
    private alertComponent: SweetAlertComponent,
    public matDialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.getTransactionsData(data["data"]);
    });
    this.start_date = new Date();
    this.start_date.setDate(this.start_date.getDate() - 7);
    this.end_date = new Date();
    this.end_date.setDate(this.end_date.getDate() - 1);
  }

  changeDate(date, type) {
    this[type] = new Date(date);;
  }

  loadFilteredTransactionData() {
    let datePipe = new DatePipe("en-US");
    let startDate =
      datePipe.transform(this.start_date, "yyyy-MM-dd") + "T00:00:00Z";
    let endDate =
      datePipe.transform(this.end_date, "yyyy-MM-dd") + "T00:00:00Z";
    if (!this.company_filter) {
      this.company_filter = "All";
    }
    this.spinner.show();

    this.transactionService
      .getTransactions(
        startDate,
        endDate,
        this.currency,
        this.company_filter,
        this.product,
        this.card,
        this.city,
        this.unit
      )
      .subscribe(
        (data) => {
          this.spinner.hide();
          this.getTransactionsData(data);
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

  getTransactionsData(data) {
    this.transactions = data["transactions"];
    this.company = data["companies"];
    this.companyLength = (data['companies'].length === 1) ? true : false;
    if (this.company_filter === "All") {
      this.company_filter = data["companies"][0].name;
    }
    this.templates = data["templates"];
    this.fields = data["fields_possible"];
    this.transactions.map((item) => {
      item.card = item.card.toString().replace(/.(?=.{4})/g, "");
    });
    this.tableData = {
      headerRow: this.columnsHeading,
      dataRows: this.transactions,
    };
  }

  downloadTransactions() {
    let datePipe = new DatePipe("en-US");
    let startDate =
      datePipe.transform(this.start_date, "yyyy-MM-dd") + "T00:00:00Z";
    let endDate =
      datePipe.transform(this.end_date, "yyyy-MM-dd") + "T00:00:00Z";
    if (!this.company_filter) {
      this.company_filter = "All";
    }
    this.spinner.show();
    this.transactionService
      .downloadReport(
        startDate,
        endDate,
        this.currency,
        this.card,
        this.city,
        this.unit,
        this.product,
        this.company_filter,
        this.template,
        this.format
      )
      .subscribe(
        (data) => {
          const blob = new Blob([data]);
          let downloadURL = window.URL.createObjectURL(blob);
          let link = document.createElement("a");
          link.href = downloadURL;
          link.download = this.getFileName();
          link.click();
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }

  formatReport(date) {
    const format = "yyyy-MM-dd_hh-mm-ss";
    return new DatePipe("en-US").transform(date, format, "UTC");
  }

  getFileName() {
    const currentTime = new Date();
    let fileExtension = "";
    if (this.format == "csv") {
      fileExtension = `.csv`;
    } else if (this.format == "dat") {
      fileExtension = `.dat`;
    } else {
      fileExtension = `.xlsx`;
    }
    return `Report_${this.formatReport(currentTime)}${fileExtension}`;
  }

  openCreateTemplateModal() {
    const dialogRef = this.matDialog.open(CreateTemplateComponent, {
      width: "500px",
      data: this.fields,
    });
    dialogRef.afterClosed().subscribe((reload) => {
      if (reload) {
        setTimeout(() => {
          window.location.reload();
        }, 2000)
      }
    });
  }
}
