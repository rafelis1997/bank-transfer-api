export type AugmentedRequired<
  T extends object,
  K extends keyof T = keyof T,
> = Omit<T, K> & Required<Pick<T, K>>
