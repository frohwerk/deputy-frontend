import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Deployment } from "../model/deployment";

@Injectable({
    providedIn: 'root'
  })
export class DeploymentService {

    constructor(private readonly http: HttpClient) { }

    listForApp(appId: string, envId?: string): Observable<Deployment[]> {
        console.log(`/api/deployments?app=${appId}&env=${envId}`);
        return this.http.get<Deployment[]>(`/api/deployments?app=${appId}&env=${envId}`);
    }

}
