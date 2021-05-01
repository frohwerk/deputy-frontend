import { Component, OnInit } from '@angular/core';
import { Application } from 'src/app/model/application';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss']
})
export class ApplicationsListComponent implements OnInit {

  applications: Application[] = [];

  name: string = "";

  constructor(private readonly api: ApplicationService) { }

  ngOnInit(): void {
    this.api.list()
      .subscribe({next: result => this.applications = result});
  }

  add(): void {
    console.log(`ApplicationsListComponent.onAdd('${this.name}')`)
    if (!this.name) return; // TODO Add error message?
    this.api
      .create(this.name)
      .subscribe(result => {
        this.applications = [...this.applications, result];
        this.name = "";
      });
  }

  remove(i: number): void {
    console.log(`removing application ${this.applications[i]?.id}`)
    if (this.applications[i]?.id) {
      this.api.
        delete(this.applications[i].id).
        subscribe(() => this.applications.splice(i, 1));
    }
  }

}
