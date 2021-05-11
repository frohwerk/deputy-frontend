export class Comparison {

    private static readonly EMPTY = "";

    constructor(
        public readonly from: string,
        public readonly to: string,
    ) { }

    static parse(spec: string): Comparison {
        const i = spec?.lastIndexOf("...")
        if (i < 0) {
            return new Comparison(spec, Comparison.EMPTY);
        } else {
            const j = i + 3
            return new Comparison(
                i > 0 ? spec?.substr(0, i) : Comparison.EMPTY,
                j > -1 && j < spec?.length ? spec?.substr(j) : Comparison.EMPTY,
            );
        }
    }

    toString(): string {
        return `Comparison{ from: "${this.from}", to: "${this.to}" }`
    }

}
