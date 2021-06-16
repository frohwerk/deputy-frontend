import { Artifact } from "../model/artifact"

export interface Application {
    id: string,
    name: string,
    created: number,
    validFrom: number,
    validUntil?: number,
    components: Artifact[],
}
