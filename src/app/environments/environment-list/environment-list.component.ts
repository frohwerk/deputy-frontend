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

  up(i: number) {
    console.log(`up(${i})`);
    if (i < 1) {
      console.log(`i out of range -> no-op`);
      return;
    }
    const env = this.environments[i];
    env.order = env.order + 1;
    this.environmentService.patch(env.id, {order: env.order}).subscribe(() => {}, err => console.log(err));
    [this.environments[i-1], this.environments[i]] = [this.environments[i], this.environments[i-1]];
  }

  down(i: number) {
    console.log(`down(${i})`);
    if (i + 1 === this.environments.length) {
      console.log(`i out of range -> no-op`)
      return;
    }
    const env = this.environments[i]
    env.order = env.order - 1
    this.environmentService.patch(env.id, {order: env.order}).subscribe(() => {}, err => console.log(err));
    [this.environments[i+1], this.environments[i]] = [this.environments[i], this.environments[i+1]]
  }

}
