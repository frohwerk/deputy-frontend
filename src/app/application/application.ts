import { Artifact } from "../artifact/artifact"

export interface Application {
    name: string,
    artifacts: Artifact[],
}
