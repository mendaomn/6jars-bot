export type JarName =
    | 'NEC'
    | 'PLY'
    | 'FFA'
    | 'EDU'
    | 'LTS'
    | 'GIV'

export interface Jar {
    id: string;
    name: JarName;
    amount: number;
    percentage: number;
}