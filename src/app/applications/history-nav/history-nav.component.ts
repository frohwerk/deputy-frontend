import { Component, Input, OnInit } from '@angular/core';
import { Application } from 'src/app/model/application';

@Component({
  selector: 'app-history-nav',
  templateUrl: './history-nav.component.html',
  styleUrls: ['./history-nav.component.scss']
})
export class HistoryNavComponent {

  @Input() app: Application;

  constructor() { }

  fromEpoch(n: number): Date {
    return new Date(Math.round(n * 1000));
  }

}
