import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, ReplaySubject } from 'rxjs';
import { filter, first, map, take, tap } from 'rxjs/operators';
import { EnvironmentService } from 'src/app/environments/environment.service';
import { Environment } from 'src/app/model/environment';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.scss']
})
export class WorkshopComponent implements OnInit {

  from = new FormControl('')

  target = new FormControl('')

  readonly envs$ = new ReplaySubject<Environment[]>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly envs: EnvironmentService,
  ) { }

  ngOnInit(): void {
    console.log(`WorkshopComponent::ngOnInit()`)
    this.envs.list().pipe(tap(() => 'GET /envs')).subscribe(this.envs$);

    const spec$ = new ReplaySubject<string>();
    this.route.params.pipe(map(p => p.spec)).subscribe(spec$);
    spec$.subscribe(spec => console.log(`next spec: ${spec}`))

    const from$ = spec$.pipe(filter(s => s !== undefined && s !== null), map(s => s.substr(0, s.indexOf(`...`))))
    from$.subscribe(from => this.from.setValue(from));

    const to = undefined

    combineLatest([spec$, this.from.valueChanges]).subscribe(([spec, from]) => {
      const prefix = spec ? '../' : './'
      const path = `${prefix}${from ? from : ''}...${to ? to : ''}`;
      console.log(`spec: '${spec}' from: '${from}' prefix: '${prefix}' path: '${path}'`)
      if (from || to) {
        console.log(`this.router.navigate(['${path}'], { relativeTo: this.route })`);
        this.router.navigate([path], { relativeTo: this.route });
      } else {
        this.router.navigate([prefix], { relativeTo: this.route });
      }
    })
    // combineLatest([this.source.valueChanges, this.target.valueChanges])
    //   .subscribe(([from, to]) => { if (from && to) this.router.navigate([`${from}...${to}`], { relativeTo: this.route }) })
  }

}
