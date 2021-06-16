import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { EnvironmentService } from 'src/app/environments/environment.service';
import { Application } from 'src/app/model/application';
import { Artifact } from 'src/app/model/artifact';
import { Environment } from 'src/app/model/environment';
import { ApplicationService } from '../application.service';
import { ComponentService } from '../component.service';

type UndoAction = () => void;

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.scss']
})
export class ApplicationViewComponent implements OnInit {

  editName = false;

  editMode = false;

  name = new FormControl('loading...')

  env = new FormControl()

  otherApps = new FormControl(false)

  id$: Observable<string>;

  envs$: Observable<Environment[]> = of([]);

  app: Application;

  app$: Observable<Application>;

  unassigned: Artifact[] = undefined;

  undo: UndoAction[] = [];

  constructor(
    private route: ActivatedRoute,
    private applications: ApplicationService,
    private environments: EnvironmentService,
    private components: ComponentService,
  ) { }

  ngOnInit(): void {
    console.log("ngOnInit")
    this.envs$ = this.environments
      .list();
    this.id$ = this.route.params
      .pipe(map(p => p.id));
    this.envs$
      .subscribe(env => this.env.setValue(env[0]?.id));
    const before$ = this.route.queryParams
      .pipe(map(params => params.before))
    this.otherApps.valueChanges
      .subscribe({ next: value => this.updateUnassigned(value) });
    this.app$ = combineLatest([this.id$, this.env.valueChanges, before$])
      .pipe(switchMap(([app, env, before]) => this.applications.get(app, env, before)), tap(() => console.log(`app is here`)));
    this.app$
      .subscribe(app => this.setApp(app))
  }

  fromEpoch(n: number): Date {
    return new Date(Math.round(n * 1000));
  }

  startEditName() {
    this.editName = true
  }

  saveEditName() {
    this.editName = false
    if (this.name.value !== this.app.name) {
      this.id$
        .pipe(switchMap(id => this.applications.updateName(id, this.name.value)))
        .subscribe({next: app => this.app.name = app.name, error: err => console.log(err)})
    }
  }

  toggleEditComponents() {
    this.editMode = true;
    if (this.unassigned == null) {
      this.updateUnassigned(this.otherApps.value)
    }
  }

  saveEditComponents() {
    this.applications.updateAssignments(this.app.id, this.app.components).subscribe(() => {
      this.editMode = false;
      this.undo = [];
    });
  }

  cancelEditComponents() {
    this.editMode = false;
    for (let f = this.undo.pop(); f; f = this.undo.pop()) f();
    console.log(`Assigned components after cancel:`, this.app.components);
    console.log(`Unassigned components after cancel:`, this.unassigned);
  }

  assignComponent(i: number) {
    // this.app.artifacts = [...this.app.artifacts, this.unassigned.splice(i, 1)[0]];
    // this.undo.push(() => this.unassigned.splice(i, 0, this.app.artifacts.splice(-1, 1)[0]));
    this.move(this.unassigned, i, this.app.components);
  }

  removeComponent(i: number) {
    // this.unassigned = [...this.unassigned, this.app.artifacts.splice(i, 1)[0]];
    // this.undo.push(() => this.app.artifacts.splice(i, 0, this.unassigned.splice(-1, 1)[0]));
    this.move(this.app.components, i, this.unassigned);
  }

  undeployed(i: number): string {
    return !this.app?.components[i]?.image
      ? "undeployed"
      : ""
  }

  move<T>(from: T[], i: number, to: T[]) {
    to.splice(to.length, 0, from.splice(i, 1)[0]);
    this.undo.push(() => from.splice(i, 0, to.splice(-1, 1)[0]));
  }

  private setApp(app: Application): void {
    if (app.components == null) {
      app.components = [];
    }
    this.app = app;
    this.name.setValue(app.name);
  }

  private updateUnassigned(otherApps: boolean): void {
    console.log(`Checkbox value: ${otherApps}`)
    if (otherApps) {
      this.id$
        .pipe(switchMap(id => this.components.list(this.env.value, id)))
        .subscribe(result => this.unassigned = result)
    } else {
      this.components
        .list(this.env.value, true)
        .subscribe(result => this.unassigned = result)
    }
  }
}
