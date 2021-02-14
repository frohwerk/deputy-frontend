import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Artifact } from 'src/app/artifact/artifact';
import { ArtifactService } from 'src/app/artifact/artifact.service';

@Component({
  selector: 'app-watch',
  templateUrl: './watch.component.html',
  styleUrls: ['./watch.component.scss']
})
export class WatchComponent implements OnInit {

  artifacts: Artifact[] = [];

  private subscriptions: Subscription[] = [];

  constructor(private artifactService: ArtifactService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.artifactService.watch().subscribe(
        event => this.artifacts = [...this.artifacts, event.object],
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
