import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Application } from './application/application';
import { Artifact } from './artifact/artifact';
import { ArtifactService } from './artifact/artifact.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  applications: Application[] = [];

  artifacts: Artifact[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private artifactService: ArtifactService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.artifactService.watch().subscribe(
        event => this.artifacts.push(event.object),
        err => console.log(`observer (err) => ${JSON.stringify(err)}`),
      )
    );
  }

  @HostListener('window:unload', ['$event'])
  ngOnDestroy(): void {
    while (this.subscriptions.length) {
      this.subscriptions.pop().unsubscribe();
    }
  }

}
