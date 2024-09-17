import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SweetAlertComponent } from "src/app/components/sweetalert/sweetalert.component";
import { TransactionService } from "src/app/services/transaction.service";
import Chart from "chart.js";
import { ToastrService } from "ngx-toastr";
import {
  getCurrentWeek,
  setEndDate,
  setStartDate,
} from "src/app/helpers/utils";

@Component({
  selector: "app-dashboard",
  templateUrl: "stats.component.html",
})
export class StatsComponent implements OnInit {
  public transactions;
  public usdTransactionCounts;
  public cadTransactionCounts;
  public filter: any = "lastMonth";
  company: [];
  public company_filter: any = sessionStorage.getItem("company") ?? "All";
  public companyLength;
  public currency: any = "";
  total_quantity = 0;
  total_units = 0;
  total_amount = 0;
  total_tax = 0;
  public customDate: Date[] = null;
  public startDate: any;
  public endDate: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private transactionService: TransactionService,
    private alertComponent: SweetAlertComponent,
    private toastService: ToastrService,
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.getTransactionsData(data["data"]);
    });
    this.startDate = setStartDate(
      new Date().setDate(new Date().getDate() - 30)
    );
    this.endDate = setEndDate(new Date().setDate(new Date().getDate() - 1));
    this.customDate = [new Date(this.startDate), new Date(this.endDate)];
  }

  onCustomDateSelected(dateRange: Date[]) {
    if (dateRange && dateRange.length === 2) {
      // Set the day to 1 for both start and end dates
      this.customDate = dateRange;
    }
  }

  clearCustomDate() {
    this.customDate = null;
  }

  loadFilteredTransactionData() {
    // let startDate, endDate;
    // if (this.filter === "thisWeek") {
    //   let curr = getCurrentWeek(new Date());
    //   this.startDate = setStartDate(curr[0]);
    //   this.endDate = setEndDate(curr[6]);
    // }

    // if (this.filter == "last3Months") {
    //   let curr = getCurrentWeek(
    //     new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
    //   );
    //   this.startDate = setStartDate(curr[0]);
    //   this.endDate = setEndDate(curr[6]);
    // }
    if (this.filter === "lastThreeMonths") {
      const today = new Date();
      // Set the start date to the 1st day of the current month, three months ago
      const startMonth = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      this.startDate = setStartDate(startMonth);
      // Set the end date to the last day of the current month
      const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      this.endDate = setEndDate(endMonth);
    }

    if (this.filter === "lastSixMonths") {
      const today = new Date();
      const lastSixMonthsStartDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);
      const lastSixMonthsEndDate = new Date(today.getFullYear(), today.getMonth(), 0);

      this.startDate = setStartDate(lastSixMonthsStartDate);
      this.endDate = setEndDate(lastSixMonthsEndDate);
    }

    if (this.filter === "lastMonth") {
      const today = new Date();

      // Calculate the start date by subtracting 30 days from the current date
      const startMonth = new Date(today);
      startMonth.setDate(today.getDate() - 30);
      this.startDate = setStartDate(startMonth);

      // Calculate the end date by subtracting 1 day from the current date
      const endMonth = new Date(today);
      endMonth.setDate(today.getDate() - 1);
      this.endDate = setEndDate(endMonth);
    }

    if (this.filter === "lastTwelveMonths") {
      const today = new Date();

      // Calculate the start date by subtracting 12 months from the current date
      const startMonth = new Date(today.getFullYear(), today.getMonth() - 11, today.getDate());
      this.startDate = setStartDate(startMonth);

      // Calculate the end date to the last day of the previous month
      const endMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      this.endDate = setEndDate(endMonth);
    }

    if (this.filter === "custom") {
      if (!this.customDate || this.customDate.length !== 2) {
        this.toastService.warning("Please select date range");
        return;
      }
      this.startDate = setStartDate(new Date(this.customDate[0]));
      this.endDate = setEndDate(new Date(this.customDate[1]));
    }

    this.spinner.show();

    this.transactionService
      .getTransactions(
        this.startDate,
        this.endDate,
        this.currency,
        this.company_filter
        )
      .subscribe(
        (data) => {
          this.spinner.hide();
          if (data["transactions"].length > 0) {
            this.getTransactionsData(data);
          }
        },
        (error) => {
          if (error.status !== 404) {
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
    this.total_quantity = 0;
    this.total_units = 0;
    this.total_amount = 0;
    this.total_tax = 0;
    // Use the reduce method to count currency-wise transactions
    const currencyCounts = this.transactions.reduce((acc, transaction) => {
      const currency = transaction.currency;
      acc[currency] = (acc[currency] || 0) + 1;
      return acc;
    }, {});

    // Get the counts for both USD and CAD
    this.usdTransactionCounts = currencyCounts["USD"] || 0;
    this.cadTransactionCounts = currencyCounts["CAD"] || 0;
    this.getTotalUsageGraph();
  }

  formatNumber(number) {
    return parseFloat(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getFormattedLastMonth() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const formattedLastMonth = `${monthNames[lastMonth.getMonth()]} ${lastMonth.getFullYear()}`;
    return formattedLastMonth;
  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  getTotalUsageGraph() {
    let cad_currency = {};
    let usd_currency = {};
    let cad_state_usage = {};
    let usd_state_usage = {};
    let product_type_usage = {};
    // Create an object to store date counts
    let cadDateCounts = {};
    let usdDateCounts = {};
    this.transactions.map((trans) => {
      this.total_quantity +=
        trans.currency === "USD" ? (trans.qty * 3.78541) : trans.qty;
      this.total_units += Number(trans.unit);
      this.total_amount +=
        trans.currency === "USD" ? (trans.amt * 1.3) : trans.amt;
      this.total_tax += trans.tax;


      // if (cad_currency[trans.tran_date]) {
      //   let cad_amount = trans.currency === "CAD" ? trans.amt : 0;
      //   cad_currency[trans.tran_date] =
      //     cad_currency[trans.tran_date] + cad_amount;
      // } else {
      //   cad_currency[trans.tran_date] =
      //     trans.currency === "CAD" ? trans.amt : 0;
      // }

      // if (usd_currency[trans.tran_date]) {
      //   let usd_amount = trans.currency === "USD" ? trans.amt : 0;
      //   usd_currency[trans.tran_date] =
      //     usd_currency[trans.tran_date] + usd_amount;
      // } else {
      //   usd_currency[trans.tran_date] =
      //     trans.currency === "USD" ? trans.amt : 0;
      // }

      // Count transactions for each date
      if (cadDateCounts[trans.tran_date]) {
        let cad_quantity = trans.currency === "CAD" ? trans.qty : 0;
        cadDateCounts[trans.tran_date] =
          cadDateCounts[trans.tran_date] + cad_quantity;
      } else {
        cadDateCounts[trans.tran_date] =
        trans.currency === "CAD" ? trans.qty : 0;
      }

      // Count transactions for each date and currency
      if (usdDateCounts[trans.tran_date]) {
        let usd_quantity = trans.currency === "USD" ? trans.qty : 0;
        usdDateCounts[trans.tran_date] = usdDateCounts[trans.tran_date] + usd_quantity;
      } else {
        usdDateCounts[trans.tran_date] = trans.currency === "USD" ? trans.qty : 0;
      }
      //------------------------------------------------------
      // stats wise pie chart data
      if (trans.currency === "CAD") {
        if (cad_state_usage[trans.state]) {
          cad_state_usage[trans.state] += parseFloat(trans.qty);
        } else {
          cad_state_usage[trans.state] = parseFloat(trans.qty);
        }
      }
      //-----------------------------------------------------------
      if (trans.currency === "USD") {
        if (usd_state_usage[trans.state]) {
          usd_state_usage[trans.state] += 1;
        } else usd_state_usage[trans.state] = 1;
      }

      if (product_type_usage[trans.item]) {
        product_type_usage[trans.item] += 1;
      } else product_type_usage[trans.item] = 1;
    });

  //----------------------------------------------------------------------------
    // Calculate the total quantity for all states in CAD transactions
    const totalCADQuantity:any = Object.values(cad_state_usage).reduce((total: number, quantity: any) => total + quantity, 0);

    // Calculate the percentage of quantity for each state
    const cadStatePercentage = {};
    for (const state in cad_state_usage) {
      const quantity = cad_state_usage[state];
      const percentage = ((quantity / totalCADQuantity) * 100).toFixed(2);
      cadStatePercentage[state] = percentage;
    }
  //---------------------------------------------------------------------------------
    // Calculate the total quantity for all states in USD transactions
    const totalUSDQuantity:any = Object.values(usd_state_usage).reduce((total: number, quantity: any) => total + quantity, 0);

    // Calculate the percentage of quantity for each state
    const usdStatePercentage = {};
    for (const state in usd_state_usage) {
      const quantity = usd_state_usage[state];
      const percentage = ((quantity / totalUSDQuantity) * 100).toFixed(2);
      usdStatePercentage[state] = percentage;
    }
  //-----------------------------------------------------------------------------------

    // Generate an array of all dates within the selected date range
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    const dateRange = [];

    let currentDate = startDate;
    while (currentDate <= endDate) {
      dateRange.push(currentDate.toISOString().split("T")[0]);
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Initialize an array for counts
    const cadCounts = [];
    const usdCounts = [];

    // Populate counts array with count values for each date
    dateRange.forEach((date) => {
      cadCounts.push(parseFloat((cadDateCounts[date] || 0).toFixed(2)));
      usdCounts.push(parseFloat((usdDateCounts[date] || 0).toFixed(2)));
    });

    // total usage chart
    document.getElementById("usage_chart").innerHTML = ""
    document.getElementById("usage_chart").innerHTML = `
      <canvas class="chart-canvas" id="total_usage_chart" width="1477" height="350"> </canvas>
    `;
    let total_usage_chart = document.getElementById("total_usage_chart");
    new Chart(total_usage_chart, {
      type: "line",
      data: {
        labels: dateRange,
        datasets: [
          {
            label: "CAD",
            data: cadCounts,
            fill: false,
            borderColor: "red",
          },
          {
            label: "USD",
            data: usdCounts,
            fill: false,
            borderColor: "green",
          },
        ],
      },
    });

    // product type chart
    const productTypecolors = Object.keys(product_type_usage).map(() => this.getRandomColor());
    document.getElementById("product_type").innerHTML = ""
    document.getElementById("product_type").innerHTML = `
      <canvas class="chart-canvas" id="product_type_chart" width="1477" height="350"> </canvas>
    `;
    let product_type_chart = document.getElementById("product_type_chart");
    new Chart(product_type_chart, {
      type: "doughnut",
      data: {
        labels: Object.keys(product_type_usage),
        datasets: [
          {
            label: "My First Dataset",
            data: Object.values(product_type_usage),
            backgroundColor: productTypecolors,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: "top"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });

    // CAD stats usage pie chart
    document.getElementById("cad_pie_chart").innerHTML = ""
    document.getElementById("cad_pie_chart").innerHTML = `
      <canvas class=" chart-canvas" id="cad_state_usage"> </canvas>
    `;

    // container.appendChild(canvas)
    const cadStatecolors = Object.keys(cadStatePercentage).map(() => this.getRandomColor());
    let cad_state_usage_chart = document.getElementById("cad_state_usage");
    new Chart(cad_state_usage_chart, {
      type: "pie",
      data: {
        labels: Object.keys(cadStatePercentage),
        datasets: [
          {
            label: "My First Dataset",
            data: Object.values(cadStatePercentage),
            backgroundColor: cadStatecolors,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: "top"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });

    // USD stats usage pie chart
    const usdStatecolors = Object.keys(usdStatePercentage).map(() => this.getRandomColor());
    document.getElementById("usd_pie_chart").innerHTML = ""
    document.getElementById("usd_pie_chart").innerHTML = `
      <canvas class=" chart-canvas" id="usd_state_usage"> </canvas>
    `;
    let usd_state_usage_chart = document.getElementById("usd_state_usage");
    new Chart(usd_state_usage_chart, {
      type: "pie",
      data: {
        labels: Object.keys(usdStatePercentage),
        datasets: [
          {
            label: "My First Dataset",
            data: Object.values(usdStatePercentage),
            backgroundColor: usdStatecolors,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: "top"
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }
}
