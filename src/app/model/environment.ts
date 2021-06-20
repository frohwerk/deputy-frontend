export interface Environment {
    id?: string
    name: string
    order?: number
    server?: string
    namespace?: string
    secret?: string
}

export interface EnvironmentPatch {
    name?: string
    order?: number
}