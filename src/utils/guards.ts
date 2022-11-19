type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type Ensure<T, K extends keyof T> = T & Required<RequiredNotNull<Pick<T, K>>>;

// given object and key, return type guard if object has key
export const keyIsNotEmpty =
  <K extends string>(key: K) =>
  <O extends Record<string, any>>(obj: O): obj is Ensure<O, K> => {
    return key in obj && obj[key] !== null && obj[key] !== undefined;
  };
