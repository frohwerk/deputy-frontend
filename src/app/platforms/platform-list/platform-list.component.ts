import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Platform } from 'src/app/model/platform';
import { PlatformService } from '../platform.service';

@Component({
  selector: 'app-platform-list',
  templateUrl: './platform-list.component.html',
  styleUrls: ['./platform-list.component.scss']
})
export class PlatformListComponent implements OnInit {

  constructor(private readonly api: PlatformService) { }

  @Input() env$: Observable<string>

  form = new FormGroup({
    name: new FormControl('', Validators.required),
  })

  platforms: Platform[] = []

  ngOnInit(): void {
    this.env$.pipe(switchMap(env => this.api.list(env)))
      .subscribe({next: platforms => this.platforms = [...this.platforms, ...platforms], error: err => console.log(err)})
  }

  add(): void {
    this.form.markAsTouched()
    if (this.form.valid) {
      console.log('TODO: Implement platform-edit component for platform details')
      this.env$
        .pipe(switchMap(env => this.api.create(env, this.form.controls.name.value)))
        .subscribe({
          next: p => this.platforms = [...this.platforms, p],
          error: err => console.log(err)
        })
      this.form.markAsUntouched()
      this.form.controls.name.setValue('')
    }
  }

  remove(i: number): void {
    this.env$
      .pipe(switchMap(env => this.api.delete(env, this.platforms[i].id)))
      .subscribe({next: () => this.platforms.splice(i, 1), error: err => console.log(err)})
  }

}
