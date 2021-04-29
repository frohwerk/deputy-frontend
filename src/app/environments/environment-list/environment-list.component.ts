import { Component, OnInit } from '@angular/core';
import { Environment } from 'src/app/model/environment';
import { EnvironmentService } from '../environment.service';

@Component({
  selector: 'app-environment-list',
  templateUrl: './environment-list.component.html',
  styleUrls: ['./environment-list.component.scss']
})
export class EnvironmentListComponent implements OnInit {

  name: string

  editMode = false

  environments: Environment[] = []

  constructor(private readonly environmentService: EnvironmentService) { }

  ngOnInit(): void {
    this.environmentService
      .list()
      .subscribe({ next: value => this.environments = value })
  }

  add() {
    if (this.name) {
      this.environmentService
        .create(this.name)
        .subscribe(env => {
          this.environments = [...this.environments, env]
          this.name = ''
        })
      // TODO: error handling
    }
  }

  remove(i: number) {
    this.environmentService
      .delete(this.environments[i].id)
      .subscribe(() => this.environments.splice(i, 1))
  }

}
