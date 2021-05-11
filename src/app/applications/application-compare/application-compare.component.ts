import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, concat, Observable, of, Subject } from 'rxjs';
import { combineAll, distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs/operators';
import { EnvironmentService } from 'src/app/environments/environment.service';
import { Application } from 'src/app/model/application';
import { Comparison } from 'src/app/model/comparison';
import { Deployment } from 'src/app/model/deployment';
import { Environment } from 'src/app/model/environment';
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

}
