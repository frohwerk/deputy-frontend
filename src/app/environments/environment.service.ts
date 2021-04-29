import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Environment } from '../model/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  constructor(private readonly http: HttpClient) { }

  get(id: string): Observable<Environment> {
    return this.http.get<Environment>(`/api/envs/${id}`);
  }

  list(): Observable<Environment[]> {
    return this.http.get<Environment[]>('/api/envs');
  }

  create(name: string): Observable<Environment> {
    return this.http.post<Environment>('/api/envs', { name: name });
  }

  update(id: string, env: Environment): Observable<Environment> {
    return this.http.put<Environment>(`/api/envs/${id}`, env);
  }

  delete(id: string): Observable<Environment> {
    return this.http.delete<Environment>(`/api/envs/${id}`)
  }

}
