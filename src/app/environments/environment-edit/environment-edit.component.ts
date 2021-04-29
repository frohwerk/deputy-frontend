import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Environment } from 'src/app/model/environment';
import { EnvironmentService } from '../environment.service';

@Component({
  selector: 'app-environment-edit',
  templateUrl: './environment-edit.component.html',
  styleUrls: ['./environment-edit.component.scss']
})
export class EnvironmentEditComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl(''),
    server: new FormControl(''),
    namespace: new FormControl(''),
    secret: new FormControl({value: '', disabled: true}),
  });

  env$: Observable<Environment>

  id$: Observable<string>

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: EnvironmentService
  ) {
    this.id$ = route.params.pipe(map(params => params['env']))
  }

  ngOnInit(): void {
    this.env$ = this.id$.pipe(switchMap(id => this.api.get(id)))
    this.env$.subscribe(env => this.form.patchValue(env))
  }

  save(): void {
    // form.value does not supply values for disabled fields
    this.route.params.pipe(
      map(params => params.env),
      switchMap(id => this.api.update(id, this.form.value))
    ).subscribe({
      next: () => this.onSaveSuccessful(),
      error: err => console.log(err)
    })
  }

  private onSaveSuccessful() {
    this.form.markAsPristine()
    this.lockSecret()
    this.form.controls['secret'].setValue('')
  }

  secretEnabled(): boolean {
    return this.form.controls['secret'].enabled
  }

  lockSecret() {
    this.form.controls['secret'].disable()
  }

  unlockSecret() {
    this.form.controls['secret'].enable()
  }

}
