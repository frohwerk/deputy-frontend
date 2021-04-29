import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Artifact } from '../../../model/artifact';

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.scss']
})
export class ComponentListComponent implements OnInit {

  @Input() artifacts: Artifact[] = [];

  @Output() onaction = new EventEmitter<Artifact>();

  constructor() { }

  ngOnInit(): void {
    // this.artifacts.push({ name: 'test-component', type: 'kubernetes/Deployment', image: 'registry.openshift.cluster/my-project/test-component:1.2.3' });
    // this.artifacts.push({ name: 'test-ui', type: 'kubernetes/Deployment', image: 'registry.openshift.cluster/my-project/test-ui:1.1.5' });
  }

}
