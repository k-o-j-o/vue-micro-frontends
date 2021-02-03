export type Constructor<T = any> = new (...args: any[]) => T;
export type AbstractConstructor<T = any> = Function & { prototype: T };