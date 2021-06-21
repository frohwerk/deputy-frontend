import { HttpErrorResponse } from '@angular/common/http';
import { isDefined } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject, Subject, zip } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ComponentService } from 'src/app/applications/component.service';
import { Artifact } from 'src/app/model/artifact';

type Action = () => void;

@Component({
  selector: 'app-component-edit',
  templateUrl: './component-edit.component.html',
  styleUrls: ['./component-edit.component.scss']
})
export class ComponentEditComponent implements OnInit {

  id$: Subject<string> = new ReplaySubject(1)

  name$: Subject<string> = new BehaviorSubject("")

  assigned$: Subject<Artifact[]> = new ReplaySubject(1)

  unassigned$: Subject<Artifact[]> = new ReplaySubject(1)

  error$: Subject<string> = new Subject()

  errors = [];

  added: string[] = []

  removed: string[] = []

  undo: Action[] = []

  constructor(
    private readonly api: ComponentService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    console.log('ComponentEditComponent::ngOnInit()')
    const components$ = this.api.list().pipe(shareReplay());
    // REMOVE ME
    this.id$.subscribe(v => console.log(`this.id$ emits ${JSON.stringify(v)}`));
    components$.subscribe(v => console.log(`components$ emits ${JSON.stringify(v)}`));
    this.assigned$.subscribe(v => console.log(`this.assigned$ emits ${JSON.stringify(v)}`));
    this.unassigned$.subscribe(v => console.log(`this.unassigned$ emits ${JSON.stringify(v)}`));
    // /REMOVE ME
    this.route.params
      .pipe(map(params => params.id))
      .subscribe(this.id$);
    this.id$
      .pipe(switchMap(id => this.api.listDependencies(id)))
      .subscribe(this.assigned$);
    combineLatest([this.id$, components$])
      .pipe(map(([id, components]) => components.find(value => value.id === id)))
      .subscribe(value => this.name$.next(value?.name));
    zip(this.id$, this.assigned$).pipe(withLatestFrom(components$))
      .pipe(
        map(([[id, assigned], all]) => [id, assigned.map(v => v.id), all] as [string, string[], Artifact[]]),
        map(([id, assigned, all]) => all.filter(c => c.id !== id && !assigned.find(id => id === c.id)))
      ).subscribe(this.unassigned$);
    // Workaround for weired bug: update from undefined to [] does not trigger a re-render...
  }

  add(i: number) {
    this.unassigned$.pipe(take(1)).subscribe(unassigned => {
      console.log(`add(${i}): unassigned = ${JSON.stringify(unassigned)}`)
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
      to.splice(to.length, 0, from.splice(i, 1)[0]);
      from$.next(from);
      to$.next(to);
      this.undo.push(() => {
        combineLatest([from$, to$]).pipe(take(1)).subscribe(([from, to]) => {
          from.splice(i, 0, to.splice(-1, 1)[0]);
          from$.next(from);
          to$.next(to);
        })
      })
    })
  }

  saveEdit() {
    this.id$.pipe(
      take(1),
      switchMap(id => this.api.patchDependencies(id, { additions: this.added, removals: this.removed })), tap(() => console.log('patch complete'))
    ).subscribe(
      () => { this.undo = []; this.added = []; this.removed = [] },
      response => { console.log(JSON.stringify(response)); this.handleError(response); }
    )
  }

  cancelEdit() {
    this.added = []
    this.removed = []
    for (let operation = this.undo.pop(); operation; operation = this.undo.pop()) operation();
  }

  error(id: string): string {
    console.log(`this.errors = ${JSON.stringify(this.errors)}`)
    const err = this.errors.find(v => v.id == id)
    console.log(`err = ${JSON.stringify(err)}`)
    return err?.message;
  }

  private handleError(response: HttpErrorResponse) {
    console.log("handleError...")
    switch (response.status) {
      case 400:
        console.log("case 400")
        const id = response.error.id as string;
        const message = response.error.message as string;
        this.errors.push({id: id, message: message});
        break;
      default:
        console.log("case default")
        console.log(`http status ${response.status}: id = '${id}' '${message}'`)
        this.error$.next(response?.error?.message);
    }
    console.log("end handleError...")
  }

}
