import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

interface Transaction {
  date?: Date;
  startAmount?: number;
  endAmount?: number;
  profit?: number;
  totalProfit?: number;
}

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
})
export class App {
  myForm!: FormGroup;
  final: Transaction = {};
  transactions: Transaction[] = [];

  ngOnInit() {
    this.myForm = new FormGroup({
      principalAmount: new FormControl(100000),
      interestRate: new FormControl(0.48),
      months: new FormControl(2),
      perDay: new FormControl(3),
      startDate: new FormControl('2023-07-29'),
    });

    const { principalAmount, interestRate, months, perDay, startDate } =
      this.myForm.value;
    this.calculate(principalAmount, interestRate, months, perDay, startDate);

    this.myForm.valueChanges.subscribe((changes) => {
      const { principalAmount, interestRate, months, perDay, startDate } =
        changes;
      this.calculate(principalAmount, interestRate, months, perDay, startDate);
    });
  }

  calculate(
    principalAmount: number,
    interestRate: number,
    months: number,
    perDay: number,
    startDate: string
  ) {
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + months);
    const currentDate = new Date(startDate);
    this.transactions = [];
    let totalProfit: number = 0;
    while (currentDate <= endDate) {
      let transaction: Transaction = {
        date: new Date(currentDate.toISOString().slice(0, 10)),
      };
      let initialAmount = principalAmount;
      for (let m = 1; m <= perDay; m++) {
        principalAmount =
          principalAmount + (principalAmount * interestRate) / 100;
      }
      transaction.startAmount = initialAmount;
      transaction.endAmount = principalAmount;
      transaction.profit = principalAmount - initialAmount;
      totalProfit += transaction.profit;
      transaction.totalProfit = totalProfit;
      currentDate.setDate(currentDate.getDate() + 1);
      this.transactions.push(transaction);
    }
    this.final = this.transactions[this.transactions.length - 1];
  }
}

bootstrapApplication(App);
