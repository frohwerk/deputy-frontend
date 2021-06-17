import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, ReplaySubject, Subject } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { ComponentService } from 'src/app/applications/component.service';
import { Artifact } from 'src/app/model/artifact';

type Action = () => void;

@Component({
  selector: 'app-component-edit',
  templateUrl: './component-edit.component.html',
  styleUrls: ['./component-edit.component.scss']
})
export class ComponentEditComponent implements OnInit {

  name$: BehaviorSubject<String> = new BehaviorSubject("")

  assigned$: Subject<Artifact[]> = new ReplaySubject()

  unassigned$: Subject<Artifact[]> = new ReplaySubject()

  added: string[] = []

  removed: string[] = []

  undo: Action[] = []

  constructor(
    private readonly api: ComponentService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const components$ = this.api.list().pipe(shareReplay())
    const id$ = this.route.params.pipe(map(params => params.id))
    combineLatest([id$, components$])
      .pipe(map(([id, components]) => components.find(value => value.id === id)))
      .subscribe(value => this.name$.next(value?.name))
    combineLatest([id$, components$])
      .pipe(map(([id, components]) => components.filter(value => value.id !== id)))
      .subscribe(values => this.unassigned$.next(values))
    combineLatest([id$, components$])
      .pipe(map(([id, components]) => components.filter(value => value.id !== id)))
      .subscribe(() => this.assigned$.next([]))
    // Workaround for weired bug: update from undefined to [] does not trigger a re-render...
  }

  add(i: number) {
    this.unassigned$.pipe(take(1)).subscribe(unassigned => {
      const j = this.removed.indexOf(unassigned[i].id)
      if (j > -1) {
        this.removed.splice(j, 1)
      } else {
        this.added.push(unassigned[i]?.id)
      }
      this.move(this.unassigned$, i, this.assigned$)
    })
  }

  remove(i: number) {
    this.assigned$.pipe(take(1)).subscribe(assigned => {
      const j = this.added.indexOf(assigned[i].id)
      if (j > -1) {
        this.added.splice(j, 1)
      } else {
        this.removed.push(assigned[i].id)
      }
      this.move(this.assigned$, i, this.unassigned$)
    })
  }

  move<T>(from$: Subject<T[]>, i: number, to$: Subject<T[]>) {
    combineLatest([from$, to$]).pipe(take(1)).subscribe(([from, to]) => {
      to.splice(to.length, 0, from.splice(i, 1)[0])
      from$.next(from)
      to$.next(to)
      this.undo.push(() => {
        combineLatest([from$, to$]).pipe(take(1)).subscribe(([from, to]) => {
          from.splice(i, 0, to.splice(-1, 1)[0]);
          from$.next(from)
          to$.next(to)
        })
      })
    })
  }

  saveEdit() {
    console.log(`Saving added = ${JSON.stringify(this.added)}`)
    console.log(`Saving removed = ${JSON.stringify(this.removed)}`)
    this.undo = []
    for (let id = this.added.pop(); id; id = this.added.pop()) console.log(`add dependency: ${id}`)
    for (let id = this.removed.pop(); id; id = this.removed.pop()) console.log(`remove dependency: ${id}`)
  }

  cancelEdit() {
    this.added = []
    this.removed = []
    for (let operation = this.undo.pop(); operation; operation = this.undo.pop()) operation();
  }

}
