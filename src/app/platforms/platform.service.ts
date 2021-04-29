import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Platform } from '../model/platform';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private readonly http: HttpClient) { }

  create(env: string, name: string): Observable<Platform> {
    return this.http.post<Platform>(`/api/envs/${env}/platforms`, {name: name})
  }

  list(env: string): Observable<Platform[]> {
    return this.http.get<Platform[]>(`/api/envs/${env}/platforms`)
  }

}
