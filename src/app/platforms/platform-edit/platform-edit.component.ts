import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Platform } from 'src/app/model/platform';
import { PlatformService } from '../platform.service';

@Component({
  selector: 'app-platform-edit',
  templateUrl: './platform-edit.component.html',
  styleUrls: ['./platform-edit.component.scss']
})
export class PlatformEditComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl(''),
    server: new FormControl(''),
    namespace: new FormControl(''),
    secret: new FormControl({value: '', disabled: true}),
  });

  platform$: Observable<Platform>

  constructor(private readonly route: ActivatedRoute, private readonly api: PlatformService) { }

  ngOnInit(): void {
    this.platform$ = this.route.params.pipe(switchMap(params => this.api.get(params.env, params.platform)))
    this.platform$.subscribe(platform => this.form.patchValue(platform))
  }

  secretEnabled(): boolean {
    return this.form.controls.secret?.enabled
  }

  lockSecret() {
    this.form.controls.secret?.disable()
  }

  unlockSecret() {
    this.form.controls.secret?.enable()
  }

  save() {
    this.route.params.pipe(
      switchMap(params => this.api.update(params.env, params.platform, this.form.value))
    ).subscribe({
      next: () => this.onSaveSuccessful(),
      error: err => console.log(err)
    })
  }

  private onSaveSuccessful() {
    this.form.controls.secret?.setValue('')
    this.form.markAsPristine()
    this.lockSecret()
  }

}
