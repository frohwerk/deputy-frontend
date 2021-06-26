import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent {

  log$ = new Subject<string>();

  constructor(
    readonly http: HttpClient,
    readonly route: ActivatedRoute,
  ) {
    route.params
      .pipe(switchMap(params => http.get(`/api/tasks/copy/${params.id}/logs`, { responseType: 'text' })))
      .subscribe(this.log$);
  }

}
