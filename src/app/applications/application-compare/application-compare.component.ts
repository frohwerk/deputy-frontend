import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
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

  source = new FormControl('')
  target = new FormControl('')

  app$ = new ReplaySubject<Application>()
  envs$ = new ReplaySubject<Environment[]>()

  from$ = new BehaviorSubject<Environment>({name: 'loading...'})
  to$ = new BehaviorSubject<Environment>({name: 'loading...'})

  left$ = new ReplaySubject<Application>()
  right$ = new ReplaySubject<Application>()

  constructor(
    readonly router: Router,
    readonly location: Location,
    readonly route: ActivatedRoute,
    readonly apps: ApplicationService,
    readonly environments: EnvironmentService,
    readonly deployments: DeploymentService,
  ) {
    environments.list().subscribe(this.envs$);

    const id$ = route.params.pipe(map(path => path.id), tap(v => console.log(`id parameter: ${v}`)));
    const sourceEnv$ = route.queryParams.pipe(map(query => query.source), filter(defined), tap(v => console.log(`source parameter: ${v}`)));
    const before$ = route.queryParams.pipe(map(query => query.before));
    const targetEnv$ = route.queryParams.pipe(map(query => query.target), filter(defined), tap(v => console.log(`target parameter: ${v}`)));

    // source$.pipe(filter(s => s)).subscribe(id => )
    this.envs$.subscribe(envs => console.log(`envs available: ${JSON.stringify(envs)}`));

    combineLatest([this.envs$, this.source.valueChanges])
      .pipe(tap(([_, id]) => console.log(`Updating this.from$ with id = ${id}`)))
      .pipe(map(([envs, id]) => envs.find(env => env?.id === id)), filter(defined))
      .pipe(tap(env => console.log(`this.from$.next(${JSON.stringify(env)})`)))
      .subscribe(this.from$);

    combineLatest([this.envs$, this.target.valueChanges])
      .pipe(tap(([_, id]) => console.log(`Updating this.to$ with id = ${id}`)))
      .pipe(map(([envs, id]) => envs.find(env => env?.id === id)), filter(defined))
      .pipe(tap(env => console.log(`this.to$.next(${JSON.stringify(env)})`)))
      .subscribe(this.to$);

    combineLatest([id$, sourceEnv$, before$])
      .pipe(switchMap(([appId, envId, before]) => apps.get(appId, envId, before)))
      .subscribe(this.left$);

    combineLatest([id$, targetEnv$])
      .pipe(switchMap(([appId, envId]) => apps.get(appId, envId)))
      .subscribe(this.right$);

    this.left$.subscribe(this.app$)

    combineLatest([this.source.valueChanges, this.target.valueChanges])
      .subscribe(([source, target]) => router.navigate([], {queryParams: { source: source, target: target}, relativeTo: route}))

    sourceEnv$.pipe(take(1)).subscribe(id => {console.log(`this.source.setValue(${id})`); this.source.setValue(id)})
    targetEnv$.pipe(take(1)).subscribe(id => {console.log(`this.target.setValue(${id})`); this.target.setValue(id)})
  
      
    // this.spec$ = combineLatest([
    //   route.params.pipe(map(params => Comparison.parse(params.spec))),
    //   this.target.valueChanges.pipe(startWith(this.target.value)),
    // ]).pipe(map(([spec, to]) => new Comparison(spec.from, to ? to : spec.to)))

    // const fromEnvId = this.spec$.pipe(map(spec => spec.from), distinctUntilChanged());
    // fromEnvId
    //   .pipe(switchMap(id => environments.get(id)))
    //   .subscribe(env => this.from$.next(env));

    // this.target.valueChanges
    //   .pipe(switchMap(to => this.envs$.pipe(map(envs => envs.find(e => e.id === to)))))
    //   .subscribe(env => this.to$.next(env));

    // this.app$ = combineLatest([id$, this.from$]).pipe(
    //   switchMap(([id, env]) => apps.get(id, env.id)),
    // );

    // combineLatest([id$, this.target.valueChanges])
    //   .pipe(switchMap(([appId, envId]) => apps.get(appId, envId)))
    //   .subscribe(app => this.right$.next(app))
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

function defined(v: any): boolean {
  return v;
}
