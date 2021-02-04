import { Component, OnInit } from '@angular/core';
import { Application } from 'src/app/application/application';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss']
})
export class ApplicationsListComponent implements OnInit {

  applications: Application[] = [];

  name: string = "";

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.applicationService.list()
      .subscribe(result => this.applications = result);
  }

  onAdd(): void {
    console.log(`ApplicationsListComponent.onAdd('${this.name}')`)
    if (!this.name) return; // TODO Add error message?
    this.applicationService.create(this.name)
      .subscribe(result => {
        this.applications = [...this.applications, result];
        this.name = "";
      });
  }

}
