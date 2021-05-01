import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Platform } from '../model/platform';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private readonly http: HttpClient) { }

  list(env: string): Observable<Platform[]> {
    return this.http.get<Platform[]>(`/api/envs/${env}/platforms`)
  }

  create(env: string, name: string): Observable<Platform> {
    return this.http.post<Platform>(`/api/envs/${env}/platforms`, {name: name})
  }

  update(env: string, id: string, platform: Platform): Observable<Platform> {
    return this.http.put<Platform>(`/api/envs/${env}/platforms/${id}`, platform)
  }

  get(env: string, platform: string): Observable<Platform> {
    return this.http.get<Platform>(`/api/envs/${env}/platforms/${platform}`)
  }

  delete(env: string, platform: string): Observable<Platform> {
    return this.http.delete<Platform>(`/api/envs/${env}/platforms/${platform}`)
  }

}
