import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Application } from '../model/application';
import { Observable } from 'rxjs';
import { Artifact } from '../model/artifact';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private readonly http: HttpClient) { }

  list(): Observable<Application[]> {
    return this.http.get<Application[]>('/api/apps');
  }

  create(name: string): Observable<Application> {
    return this.http.post<Application>('/api/apps', { name: name });
  }

  get(app: string, env: string, before?: string): Observable<Application> {
    if (before) {
      console.log(`GET /api/apps/${app}?env=${env}&before=${before}`)
      return this.http.get<Application>(`/api/apps/${app}?env=${env}&before=${before}`)
        .pipe(
          map(app => { if (!app.components) app.components = []; return app; }),
          tap(app => console.log(`Got app, type of validFrom: ${typeof app?.validFrom}`)),
        )
    } else {
      console.log(`GET /api/apps/${app}?env=${env}`)
      return this.http.get<Application>(`/api/apps/${app}?env=${env}`)
      .pipe(
        map(app => { if (!app.components) app.components = []; return app; }),
        tap(app => console.log(`Got app, type of validFrom: ${typeof app?.validFrom}`)),
      )
  }
  }

  delete(id: string): Observable<Application> {
    return this.http.delete<Application>(`/api/apps/${id}`);
  }

  updateName(id: string, name: string): Observable<Application> {
    return this.http.patch<Application>(`/api/apps/${id}`, { name: name });
  }

  updateAssignments(id: string, components: Artifact[]): Observable<void> {
    return this.http.put<void>(`/api/apps/${id}/components`, components);
  }

}
