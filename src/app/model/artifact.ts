import { Deployment } from "./deployment";

export interface Artifact {
    id?: string,
    name: string,
    image?: string,
    deployed?: Date,
}
