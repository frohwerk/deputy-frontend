import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artifact } from '../model/artifact';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private http: HttpClient) { }

  list(value?: boolean | string | undefined): Observable<Artifact[]> {
    switch (typeof value) {
      case "string":
        return this.http.get<Artifact[]>(`/api/components?unassigned=${value}`);
      default:
        return this.http.get<Artifact[]>(`/api/components${value ? '?unassigned' : ''}`);
    }
  }

  listUnassignedForApp(appId: string): Observable<Artifact[]> {
    return this.http.get<Artifact[]>(`/api/components?unassigned=${appId}`);
  }

}
