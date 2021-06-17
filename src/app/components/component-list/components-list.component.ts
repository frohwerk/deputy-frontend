import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentService } from 'src/app/applications/component.service';
import { Artifact } from 'src/app/model/artifact';

@Component({
  selector: 'app-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss']
})
export class ComponentsListComponent implements OnInit {

  components$: Observable<Artifact[]>

  constructor(private readonly api: ComponentService) { }

  ngOnInit(): void {
    this.components$ = this.api.list()
  }

}
