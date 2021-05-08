import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Application } from '../../model/application';
import { Artifact } from '../../model/artifact';
import { ArtifactService } from '../../artifact/artifact.service';

@Component({
  selector: 'app-edit-application',
  templateUrl: './application-edit.component.html',
  styleUrls: ['./application-edit.component.scss']
})
export class ApplicationEditComponent implements OnInit {

  applications: Application[] = [];

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

  assign(artifact: Artifact) {
    console.log(`Adding artifact: ${JSON.stringify(artifact)}`)
  }

  unassign(artifact: Artifact) {
    console.log(`Removing artifact: ${JSON.stringify(artifact)}`)
  }

  get members(): Artifact[] {
    return [
      { name: 'test-component', deployments: [{image: 'registry.openshift.cluster/my-project/test-component:1.2.3'}] },
      { name: 'test-ui', deployments: [{image: 'registry.openshift.cluster/my-project/test-ui:1.1.5'}] },
    ];
  }

}
