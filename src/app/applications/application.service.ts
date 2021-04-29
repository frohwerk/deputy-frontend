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

  get(id: string): Observable<Application> {
    return this.http.get<Application>(`/api/apps/${id}`);
  }

  create(name: string): Observable<Application> {
    return this.http.post<Application>('/api/apps', { name: name });
  }

  updateAssignments(id: string, components: Artifact[]): Observable<void> {
    return this.http.put<void>(`/api/apps/${id}/components`, components);
  }

}
