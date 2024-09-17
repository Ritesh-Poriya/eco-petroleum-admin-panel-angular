import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { TransactionService } from "src/app/services/transaction.service";
import { SweetAlertComponent } from "../sweetalert/sweetalert.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-template",
  templateUrl: "./create-template.component.html",
  styleUrls: ["./create-template.component.scss"],
})
export class CreateTemplateComponent {
  public changed = true;
  public template: any;
  public error = "";
  public selectedFields = [];
  columns = [];
  selectedColumns = new FormControl([]);

  constructor(
    public dialogRef: MatDialogRef<CreateTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public transactionService: TransactionService,
    private spinner: NgxSpinnerService,
    private alertComponent: SweetAlertComponent,
    private router: Router
  ) {}

  ngOnInit() {
    this.error = "";
    this.columns = this.data;
    this.template = {
      template_name: "",
    };
  }

  onFieldOrderChanged(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.selectedColumns.getRawValue(), event.previousIndex, event.currentIndex);
  }

  removeColumns(index) {
    let selectedFields = this.selectedColumns.getRawValue();
    selectedFields.splice(index, 1);
    this.selectedColumns.setValue(selectedFields);
  }

  public onCloseClick(e) {
    e.preventDefault();
    this.dialogRef.close(false);
  }

  // handle template creation
  public onSubmit(body, isValid) {
    if (isValid) {
      body["template_create"] = "yes";
      body["template_columns"] = this.selectedColumns.getRawValue();
      this.spinner.show();

      this.transactionService.createTemplate(body).subscribe(
        (data) => {
          this.spinner.hide();
          this.dialogRef.close(true);
          this.alertComponent.showSwal(
            "success-message",
            "Reports template created successfully!"
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
}
