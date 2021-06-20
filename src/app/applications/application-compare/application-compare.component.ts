import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { EnvironmentService } from 'src/app/environments/environment.service';
import { Application } from 'src/app/model/application';
import { Artifact } from 'src/app/model/artifact';
import { Comparison } from 'src/app/model/comparison';
import { Deployment } from 'src/app/model/deployment';
import { Environment } from 'src/app/model/environment';
import { vcompare } from 'src/app/shared/versions';
import { ApplicationService } from '../application.service';
import { DeploymentService } from '../deployment.service';

@Component({
  selector: 'app-application-compare',
  templateUrl: './application-compare.component.html',
  styleUrls: ['./application-compare.component.scss']
})
export class ApplicationCompareComponent implements OnInit {

  target = new FormControl('')

  id$: Observable<string>
  spec$: Observable<Comparison>

  app$: Observable<Application>
  envs$: Observable<Environment[]>

  from$ = new BehaviorSubject<Environment>({name: 'loading...'})
  to$ = new BehaviorSubject<Environment>({name: 'loading...'})

  left$ = new ReplaySubject<Application>()
  right$ = new ReplaySubject<Application>()

  constructor(
    readonly location: Location,
    readonly route: ActivatedRoute,
    readonly apps: ApplicationService,
    readonly environments: EnvironmentService,
    readonly deployments: DeploymentService,
  ) {
    this.envs$ = environments.list();

    this.id$ = route.params.pipe(map(params => params.id));

    // TODO: Use me!
    const before$ = route.queryParams.pipe(map(params => params.before))
    before$.subscribe(before => console.log(`before: ${before}`))

    this.spec$ = combineLatest([
      route.params.pipe(map(params => Comparison.parse(params.spec))),
      this.target.valueChanges.pipe(startWith(this.target.value)),
    ]).pipe(map(([spec, to]) => new Comparison(spec.from, to ? to : spec.to)))

    const fromEnvId = this.spec$.pipe(map(spec => spec.from), distinctUntilChanged());
    fromEnvId
      .pipe(switchMap(id => environments.get(id)))
      .subscribe(env => this.from$.next(env));

    this.target.valueChanges
      .pipe(switchMap(to => this.envs$.pipe(map(envs => envs.find(e => e.id === to)))))
      .subscribe(env => this.to$.next(env));

    this.app$ = combineLatest([this.id$, this.from$]).pipe(
      switchMap(([id, env]) => apps.get(id, env.id)),
    );

    combineLatest([this.id$, fromEnvId, before$])
      .pipe(switchMap(([appId, envId, before]) => apps.get(appId, envId, before)))
      .subscribe(app => this.left$.next(app))
    combineLatest([this.id$, this.target.valueChanges])
      .pipe(switchMap(([appId, envId]) => apps.get(appId, envId)))
      .subscribe(app => this.right$.next(app))
  }

  ngOnInit(): void { }

  fromEpoch(n: number): Date {
    return new Date(Math.round(n * 1000));
  }

  back() {
    this.location.back();
  }

  comparisonClass(deployment: Artifact, reference: Application): string {
    const other = reference?.components?.find(v => v?.name == deployment.name);
    if (!other) return "";
    switch (vcompare(tag(deployment), tag(other))) {
      case -1:
        return "older";
      case +1:
        return "newer";
      default:
        return "";
    }
  }
}

function tag(d: Deployment): string {
  if (!d || !d.image) return undefined;
  const i = d.image.lastIndexOf(":") + 1;
  return i < d.image.length
    ? d.image.substr(i + 1)
    : "";
}
