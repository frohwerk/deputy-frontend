const EQUAL = 0
const UNCOMPARABLE = 0
const SMALLER = -1
const LARGER = +1

export function vcompare(s1: string, s2: string): number {
    if (!s1 || !s2) return UNCOMPARABLE;
    const v1 = s1.split(".");
    const v2 = s2.split(".");
    for (let i = 0; i < Math.min(v1.length, v2.length); i++) {
        const e1 = v1[i], e2 = v2[i];
        if (e1 < e2) return SMALLER;
        if (e1 > e2) return LARGER;
    }
    return v1.length < v2.length
        ? LARGER
        : v1.length > v2.length
        ? SMALLER
        : EQUAL;
}