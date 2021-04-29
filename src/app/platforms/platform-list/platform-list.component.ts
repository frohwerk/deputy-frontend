import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
    console.log('TODO: Implement server list API component for platform listing')
  }

  add(): void {
    this.form.markAsTouched()
    if (this.form.valid) {
      console.log('TODO: Implement server create API for PlatformListComponent::add()')
      console.log('TODO: Implement platform-edit component for platform details')
      this.env$
        .pipe(switchMap(env => this.api.create(env, this.form.controls.name.value)))
        .subscribe({
          next: p => this.platforms = [...this.platforms, p],
          error: err => console.log(err)
        })

      this.platforms = [...this.platforms, { name: this.form.controls.name.value }]
      this.form.markAsUntouched()
      this.form.controls.name.setValue('')
    }
  }

  remove(i: number): void {
    console.log('TODO: Implement API call for PlatformListComponent::remove(number)')
    this.platforms.splice(i, 1)
  }

}
