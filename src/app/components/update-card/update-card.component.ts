import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { CardsService } from "src/app/services/cards.service";
import { SweetAlertComponent } from "../sweetalert/sweetalert.component";

@Component({
  selector: "app-update-card",
  templateUrl: "./update-card.component.html",
  styleUrls: ["./update-card.component.scss"],
})
export class UpdateCardComponent {
  card: any;

  constructor(
    public dialogRef: MatDialogRef<UpdateCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private spinner: NgxSpinnerService,
    private _cardService: CardsService,
    private alertComponent: SweetAlertComponent
  ) {}
  ngOnInit() {
    this.card = {
      drivername: this.data.drivername,
      unit: this.data.unit,
      pin: this.data.pin,
      limit_ulsd: this.data.limit_ulsd,
      limit_rfr: this.data.limit_rfr,
      limit_defd: this.data.limit_defd,
      cashadvance_limit: this.data.cashadvance_limit,
      cashadvance_cycle: this.data.cashadvance_cycle,
      status: this.data.status == "Inactive" ? "Inactive" : "Active",
    };
  }

  changeLimit(value, name) {
    this.card[name] = Number(value);
  }

  public onSubmit(value, isValid) {
    if (isValid) {
      const body = {
        ...value,
        card: this.data.card,
        status: this.card.status,
      };
      this.spinner.show();
      this._cardService.updateCards(body).subscribe(
        (data) => {
          this.spinner.hide();
          this.dialogRef.close(true);
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
  }

  toggleStatus(event: any): void {
    this.card.status = event.checked ? 'Active' : 'Inactive';
  }
}
