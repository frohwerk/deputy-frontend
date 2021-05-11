import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Application } from '../model/application';
import { Observable } from 'rxjs';
import { Artifact } from '../model/artifact';

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

  get(app: string, env: string): Observable<Application> {
    console.log(`GET /api/apps/${app}?env=${env}`)
    return this.http.get<Application>(`/api/apps/${app}?env=${env}`);
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
