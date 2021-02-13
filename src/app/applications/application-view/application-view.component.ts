import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Application } from '../../application/application';
import { Artifact } from '../../artifact/artifact';
import { ApplicationService } from '../application.service';
import { ComponentService } from '../component.service';

@Component({
  selector: 'app-application-view',
  templateUrl: './application-view.component.html',
  styleUrls: ['./application-view.component.scss']
})
export class ApplicationViewComponent implements OnInit {

  edit = false;

  app: Application

  unassigned: Artifact[]

  constructor(
    private route: ActivatedRoute,
    private applications: ApplicationService,
    private components: ComponentService,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.applications.get(id)),
    ).subscribe(
      app => this.app = app
    );
  }

  toggleEdit() {
    this.edit = !this.edit;
    if (this.edit && !this.unassigned) {
      this.components.list(true).subscribe(result => this.unassigned = result)
    }
  }

}
