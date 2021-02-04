import { Artifact } from "../artifact/artifact"

export interface Application {
    id: string,
    name: string,
    artifacts?: Artifact[],
}
