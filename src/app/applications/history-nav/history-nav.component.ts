import { Component, Input, OnInit } from '@angular/core';
import { Application } from 'src/app/model/application';

interface Query {
  source?: string
  target?: string
  before?: number
}

@Component({
  selector: 'app-history-nav',
  templateUrl: './history-nav.component.html',
  styleUrls: ['./history-nav.component.scss']
})
export class HistoryNavComponent {

  @Input() app: Application;

  @Input() queryParams: Query;

  constructor() { }

  fromEpoch(n: number): Date {
    return new Date(Math.round(n * 1000));
  }

  query(before?: number): Query {
    return {
      source: this.queryParams?.source ? this.queryParams.source : undefined,
      target: this.queryParams?.target ? this.queryParams.target : undefined,
      before: before,
    }
  }

}
