import { Artifact } from "../model/artifact"

export interface Application {
    id: string,
    name: string,
    artifacts?: Artifact[],
}
