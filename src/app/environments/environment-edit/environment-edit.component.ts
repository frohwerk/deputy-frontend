import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Environment } from 'src/app/model/environment';
import { EnvironmentService } from '../environment.service';

@Component({
  selector: 'app-environment-edit',
  templateUrl: './environment-edit.component.html',
  styleUrls: ['./environment-edit.component.scss']
})
export class EnvironmentEditComponent implements OnInit {

  name = new FormControl('loading...')
  
  id$: Observable<string>
  env$: Observable<Environment>
  
  title = "loading..."
  editMode = false

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: EnvironmentService
  ) {
    this.id$ = route.params.pipe(map(params => params['env']))
  }

  ngOnInit(): void {
    this.env$ = this.id$.pipe(switchMap(id => this.api.get(id)))
    this.env$.subscribe(env => this.name.setValue(env.name))
  }

  save(): void {
    // form.value does not supply values for disabled fields
    if (this.name.dirty) {
      this.route.params.pipe(
        map(params => params.env),
        switchMap(id => this.api.update(id, {name: this.name.value}))
      ).subscribe({
        next: () => this.onSaveSuccessful(),
        error: err => console.log(err)
      })
    } else {
      this.toggleEditMode()
    }
  }

  private onSaveSuccessful() {
    this.name.markAsPristine()
    this.toggleEditMode()
  }

  toggleEditMode() {
    this.editMode = !this.editMode
  }

}
