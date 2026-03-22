/**
 * Make some property optional on type
 *
 * @example
 * ```typescript
 * type User {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * Optional<User, 'id' | 'email'>
 * ```
 **/
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
