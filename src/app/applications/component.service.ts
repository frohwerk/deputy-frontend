import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artifact } from '../model/artifact';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private http: HttpClient) { }

  list(env?: string, value?: boolean | string | undefined): Observable<Artifact[]> {
    if (!env) {
      console.log(`Loading all components...`)
      return this.http.get<Artifact[]>(`/api/components`);
    }

    switch (typeof value) {
      case "string":
        return this.http.get<Artifact[]>(`/api/components?env=${env}&unassigned=${value}`);
      default:
        return this.http.get<Artifact[]>(`/api/components?env=${env}${value ? '&unassigned' : ''}`);
    }
  }

}
