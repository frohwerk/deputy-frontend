import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Application } from 'src/app/model/application';
import { Artifact } from 'src/app/model/artifact';
import { ApplicationService } from '../application.service';
import { ComponentService } from '../component.service';

type UndoAction = () => void;

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.scss']
})
export class ApplicationViewComponent implements OnInit {

  editMode = false;

  app: Application;

  unassigned: Artifact[] = undefined;

  undo: UndoAction[] = [];

  constructor(
    private route: ActivatedRoute,
    private applications: ApplicationService,
    private components: ComponentService,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.applications.get(id)),
    ).subscribe(app => {
      if (app.artifacts == null) {
        app.artifacts = [];
      }
      this.app = app;
    });
  }

  toggleEdit() {
    this.editMode = true;
    if (this.unassigned == null) {
      this.components.list(true).subscribe(result => this.unassigned = result);
    }
  }

  saveEdit() {
    this.applications.updateAssignments(this.app.id, this.app.artifacts).subscribe(() => {
      this.editMode = false;
      this.undo = [];
    });
  }

  cancelEdit() {
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

}
