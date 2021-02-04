import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Application } from '../application/application';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private http: HttpClient) { }

  list(): Observable<Application[]> {
    return this.http.get<Application[]>('/api/apps');
  }

  get(id: string): Observable<Application> {
    return this.http.get<Application>(`/api/apps/${id}`);
  }

  create(name: string): Observable<Application> {
    return this.http.post<Application>('/api/apps', { name: name });
  }

}
