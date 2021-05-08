import { Deployment } from "./deployment";

export interface Artifact {
    name: string,
    deployments?: Deployment[],
}
