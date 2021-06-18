import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artifact } from '../model/artifact';
import { DependenciesChange } from '../model/dependencies';

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

  listDependencies(componentId: string): Observable<Artifact[]> {
    return this.http.get<Artifact[]>(`/api/components/${componentId}/dependencies`)
  }

  patchDependencies(componentId: string, changes: DependenciesChange): Observable<Artifact[]> {
    return this.http.patch<Artifact[]>(`/api/components/${componentId}/dependencies`, changes)
  }

}
