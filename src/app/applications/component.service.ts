import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Artifact } from '../model/artifact';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private http: HttpClient) { }

  list(unassignedOnly?: boolean): Observable<Artifact[]> {
    return this.http.get<Artifact[]>(`/api/components${unassignedOnly ? '?unassigned' : ''}`);
  }

}
