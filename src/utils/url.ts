/**
 * Construct URL search params and convert them to string
 * @param params params to add
 */
export const searchParamsString = (params: Record<string, string>): string => {
  const urlSearchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => urlSearchParams.append(key, value));

  return urlSearchParams.toString();
};

export const createUrlWithParams = (url: string, params: Record<string, string>): string => {
  return `${url}?${searchParamsString(params)}`;
};
