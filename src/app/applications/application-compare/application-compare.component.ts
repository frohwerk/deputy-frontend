import { Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, ReplaySubject, Subject } from 'rxjs';
import { defaultIfEmpty, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { EnvironmentService } from 'src/app/environments/environment.service';
import { Application } from 'src/app/model/application';
import { Artifact } from 'src/app/model/artifact';
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

  app$ = new ReplaySubject<Application>(1)
  envs$ = new ReplaySubject<Environment[]>(1)

  from$ = new BehaviorSubject<Environment>({ name: 'loading...' })
  to$ = new BehaviorSubject<Environment>({ name: 'loading...' })

  left$ = new ReplaySubject<Application>(1)
  right$ = new ReplaySubject<Application>(1)

  before$ = new ReplaySubject<string>(1)
  copyViable$ = new ReplaySubject<boolean>(1)

  message$ = new Subject()

  constructor(
    readonly http: HttpClient,
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
    const targetEnv$ = route.queryParams.pipe(map(query => query.target), filter(defined), tap(v => console.log(`target parameter: ${v}`)));
    route.queryParams.pipe(map(query => query.before)).subscribe(this.before$);

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

    combineLatest([id$, sourceEnv$, this.before$])
      .pipe(switchMap(([appId, envId, before]) => apps.get(appId, envId, before)), map(sortComponentsByName))
      .subscribe(this.left$);

    combineLatest([id$, targetEnv$])
      .pipe(switchMap(([appId, envId]) => apps.get(appId, envId)), map(sortComponentsByName))
      .subscribe(this.right$);

    combineLatest([this.left$, this.right$])
      .pipe(map(([source, target]) => source?.components?.filter(c => c.image)?.length == target?.components?.filter(c => c.image)?.length))
      .subscribe(this.copyViable$);

    this.left$.subscribe(this.app$)

    combineLatest([this.source.valueChanges, this.target.valueChanges])
      .subscribe(([source, target]) => router.navigate([], { queryParams: { source: source, target: target }, relativeTo: route }))

    sourceEnv$.pipe(take(1)).subscribe(id => { console.log(`this.source.setValue(${id})`); this.source.setValue(id) })
    targetEnv$.pipe(take(1)).subscribe(id => { console.log(`this.target.setValue(${id})`); this.target.setValue(id) })


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

  copyViable(): boolean {
    combineLatest([this.left$, this.right$])
      .pipe(map(([source, target]) => source?.components?.length == target?.components?.length))
    return false;
  }

  doCopy(): void {
    combineLatest([this.left$, this.from$, this.to$, this.before$.pipe(defaultIfEmpty(`now`))]).pipe(
      take(1),
      switchMap(([app, from, to, before]) => {
        const params = new HttpParams()
          .set(`appId`, app.id)
          .set(`source`, from.id)
          .set(`target`, to.id)
          .set(`before`, before ? before : "now")
          .set(`dryRun`, `true`)
          return this.http.post<string>(`/api/tasks/copy`, null, { params: params })
      })
    ).subscribe(this.message$)
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

function sortComponentsByName(app: Application): Application {
  app.components.sort((a, b) => a?.name < b?.name ? -1 : 1)
  return app;
}