import { saveAs } from 'file-saver';
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SweetAlertComponent } from "src/app/components/sweetalert/sweetalert.component";
import { UpdateCardComponent } from "src/app/components/update-card/update-card.component";
import { CardsService } from "src/app/services/cards.service";
import * as XLSX from 'xlsx';
export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox"
}
@Component({
  selector: "app-cards",
  templateUrl: "cards.component.html",
  styleUrls: ["./cards.components.scss"]
})
export class CardsComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  rows: any = [];
  SelectionType = SelectionType;
  constructor(
    private activatedRoute: ActivatedRoute,
    public matDialog: MatDialog,
    public _cardService: CardsService,
    public alertComponent: SweetAlertComponent,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  public displayedColumns: string[] = [
    "Card",
    "Driver Name",
    // "Pin",
    "Status",
    "Unit",
    "Action",
  ];
  public tableData: any;
  public originalData: any; // Store the original data
  public searchText: string = '';

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.tableData = {
        headerRow: this.displayedColumns,
        dataRows: data.data,
      };
    });
    this.originalData = this.tableData.dataRows;
    this.temp = this.tableData.dataRows.map((prop, key) => {
      return {
        ...prop,
        id: key
      };
    });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }

  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  filterData($event) {
    console.log("🚀 ~ file: cards.component.ts:49 ~ CardsComponent ~ filterData ~ event:", $event)
    this.searchText = $event;
    if (this.searchText === '') {
      // If search input is empty, show all data from the original data
      this.temp = this.originalData;
    } else {
      // Filter the original data based on the search text
      this.temp = this.originalData.filter((row) => {
        return Object.values(row).some(
          	(value) =>
            	value &&
            	value.toString().toLowerCase().includes(this.searchText.toLowerCase())
      	);
      })
    }
  }

  exportToExcel() {
     // Define custom filename with the current date and time
     const currentDate = new Date();
     const formattedDate = this.formatDate(currentDate);

     const customFieldsData = this.tableData.dataRows.map((row) => {
       return {
        "CardNumber": row.card,
        "Unit": row.unit,
        "Driver Name": row.drivername,
        "Status": row.status
       };
     });

     // Convert the custom fields data to an Excel worksheet
     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(customFieldsData);

     // Create the workbook and Excel buffer
     const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

     // Create a Blob and save it with the custom filename
     const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
     saveAs(blob, `CardLists_${formattedDate}.xlsx`);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

  resetData() {
    // Reset the displayed data to the original data
    this.tableData.dataRows = this.originalData;
  }


  updateCard(data) {
    const dialogRef = this.matDialog.open(UpdateCardComponent, {
      width: "510px",
      data: data,
      autoFocus: false,
      height: "90%",
    });
    dialogRef.afterClosed().subscribe((reload) => {
      if (reload) {
        window.location.reload();
      }
    });
  }

  changeStatus(data, status) {
    let body = {
      ...data,
      status: status ? "Active" : "Inactive",
    };
    this.spinner.show();

    this._cardService.updateCards(body).subscribe(
      (data) => {
        this.alertComponent.showSwal(
          "success-message",
          "Status changed successfully"
        );
        this.spinner.hide();
      },
      (error) => {
        this.alertComponent.showSwal(
          "error-response",
          "Something went wrong, please try again later. For urgencies contact; support@ecopetroleum.ca"
        );
        this.spinner.hide();
      }
    );
  }

  // public downloadPDF(): void {
  //   this.spinner.show();
  //   this._cardService
  //     .getCardFileName(

  //     )
  //     .subscribe(
  //       (fileData) => {
  //         let fileName = `${fileData["filename"]}`;
  //         this._cardService
  //           .downloadCard()
  //           .subscribe(
  //             (data) => {
  //               this.spinner.hide();
  //               saveAs(data as unknown as string, fileName);
  //             },
  //             (error) => {
  //               if (error.status === 401) {
  //                 this.alertComponent.showSwal(
  //                   "error-response",
  //                   "Your token is expired. Please login again"
  //                 ).then(() => {
  //                   sessionStorage.removeItem("currentUser");
  //                   sessionStorage.removeItem("company");
  //                   this.router.navigate(["/login"]);
  //                 });
  //               } else if (error.status !== 404) {
  //                 this.alertComponent.showSwal(
  //                   "error-response",
  //                   "An internal error occurred while processing your request. Our team has been notified and will look into the issue. Please try again later or contact support@ecopetroleum.ca"
  //                 );
  //               }
  //               this.spinner.hide();
  //             }
  //           );
  //       },
  //       (error) => {
  //         if (error.status === 401) {
  //           this.alertComponent.showSwal(
  //             "error-response",
  //             "Your token is expired. Please login again"
  //           ).then(() => {
  //             sessionStorage.removeItem("currentUser");
  //             sessionStorage.removeItem("company");
  //             this.router.navigate(["/login"]);
  //           });
  //         } else if (error.status !== 404) {
  //           this.alertComponent.showSwal(
  //             "error-response",
  //             "An internal error occurred while processing your request. Our team has been notified and will look into the issue. Please try again later or contact support@ecopetroleum.ca"
  //           );
  //         }
  //         this.spinner.hide();
  //       }
  //     );
  // }
}
