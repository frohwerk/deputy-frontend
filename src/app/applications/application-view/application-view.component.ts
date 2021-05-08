import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
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

  env = new FormControl()

  otherApps = new FormControl(false)

  id$: Observable<string>;

  envs$: Observable<Environment[]>;

  app: Application;

  unassigned: Artifact[] = undefined;

  undo: UndoAction[] = [];

  constructor(
    private route: ActivatedRoute,
    private applications: ApplicationService,
    private environments: EnvironmentService,
    private components: ComponentService,
  ) { }

  ngOnInit(): void {
    this.envs$ = this.environments
      .list();
    this.id$ = this.route.params
      .pipe(map(p => p.id));
    this.envs$
      .subscribe(env => this.env.setValue(env[0]?.id));
    // combineLatest([this.id$, this.env$])
    //   .subscribe(([id, env]) => console.log(`/api/apps/${id}?env=${env?.id}`))
      // .pipe(switchMap(([id, env]) => this.applications.get(id, env.id)))
      // .subscribe(app => this.setApp(app))
    this.otherApps.valueChanges
      .subscribe({ next: value => this.updateUnassigned(value) });
    combineLatest([this.id$, this.env.valueChanges])
      .pipe(switchMap(([app, env]) => this.applications.get(app, env)))
      .subscribe(app => this.setApp(app))
  }

  startEditName() {
    this.editName = true
  }


  saveEditName() {
    this.editName = false
  }

  toggleEditComponents() {
    this.editMode = true;
    if (this.unassigned == null) {
      this.components.list(true).subscribe(result => this.unassigned = result);
    }
  }

  saveEditComponents() {
    this.applications.updateAssignments(this.app.id, this.app.artifacts).subscribe(() => {
      this.editMode = false;
      this.undo = [];
    });
  }

  cancelEditComponents() {
    this.editMode = false;
    for (let f = this.undo.pop(); f; f = this.undo.pop()) f();
    console.log(`Assigned components after cancel:`, this.app.artifacts);
    console.log(`Unassigned components after cancel:`, this.unassigned);
  }

  assignComponent(i: number) {
    // this.app.artifacts = [...this.app.artifacts, this.unassigned.splice(i, 1)[0]];
    // this.undo.push(() => this.unassigned.splice(i, 0, this.app.artifacts.splice(-1, 1)[0]));
    this.move(this.unassigned, i, this.app.artifacts);
  }

  removeComponent(i: number) {
    // this.unassigned = [...this.unassigned, this.app.artifacts.splice(i, 1)[0]];
    // this.undo.push(() => this.app.artifacts.splice(i, 0, this.unassigned.splice(-1, 1)[0]));
    this.move(this.app.artifacts, i, this.unassigned);
  }


  move<T>(from: T[], i: number, to: T[]) {
    to.splice(to.length, 0, from.splice(i, 1)[0]);
    this.undo.push(() => from.splice(i, 0, to.splice(-1, 1)[0]));
  }

  private setApp(app: Application): void {
    if (app.artifacts == null) {
      app.artifacts = [];
    }
    this.app = app;
  }
  private updateUnassigned(otherApps: boolean): void {
    console.log(`Checkbox value: ${otherApps}`)
    if (otherApps) {
      this.id$
        .pipe(switchMap(id => this.components.list(id)))
        .subscribe(result => this.unassigned = result)
    } else {
      this.components.list(true)
        .subscribe(result => this.unassigned = result)
    }
  }
}
