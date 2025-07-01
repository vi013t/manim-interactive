export type DeepReadonly<T> = { readonly [Key in keyof T]: DeepReadonly<T[Key]> };
