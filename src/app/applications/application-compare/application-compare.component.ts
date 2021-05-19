import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { EnvironmentService } from 'src/app/environments/environment.service';
import { Application } from 'src/app/model/application';
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

  from$: Observable<Environment>
  to$: Observable<Environment>

  left$: Observable<Deployment[]>
  right$: Observable<Deployment[]>

  constructor(
    private readonly location: Location,
    route: ActivatedRoute,
    apps: ApplicationService,
    private readonly environments: EnvironmentService,
    private readonly deployments: DeploymentService,
  ) {
    this.envs$ = environments.list();

    this.id$ = route.params.pipe(
      map(params => params.id),
    );

    this.spec$ = combineLatest([
      route.params.pipe(map(params => Comparison.parse(params.spec))),
      this.target.valueChanges.pipe(startWith(this.target.value)),
    ]).pipe(map(([spec, to]) => new Comparison(spec.from, to ? to : spec.to)))

    const fromEnvId = this.spec$.pipe(
      map(spec => spec.from),
      distinctUntilChanged(),
    );
    this.from$ = fromEnvId.pipe(
      switchMap(from => environments.get(from)),
      startWith({ name: "loading..." }),
    );

    const toEnvId = this.spec$.pipe(
      map(spec => spec.to),
      distinctUntilChanged(),
    );
    this.to$ = toEnvId.pipe(
      switchMap(to => this.envs$.pipe(map(envs => envs.find(e => e.id === to) || { name: "No target chosen yet..." }))),
      startWith({ name: "loading..." }),
    );

    this.app$ = combineLatest([this.id$, this.from$]).pipe(
      switchMap(([id, env]) => apps.get(id, env.id)),
    );

    this.left$ = combineLatest([this.id$, fromEnvId]).pipe(
      switchMap(([appId, envId]) => deployments.listForApp(appId, envId))
    )
    this.right$ = combineLatest([this.id$, this.target.valueChanges]).pipe(
      switchMap(([appId, envId]) => deployments.listForApp(appId, envId))
    )
  }

  ngOnInit(): void { }

  onChangeFrom(id: string) {
    this.from$ = this.from$.pipe(switchMap(() => this.environments.get(id)))
  }

  back() {
    this.location.back();
  }

  comparisonClass(deployment: Deployment, referenceSet: Deployment[]): string {
    const other = referenceSet?.find(v => v?.name == deployment.name);
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
