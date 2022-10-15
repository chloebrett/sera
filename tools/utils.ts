export const getFiltersFromQueryParam = (parmValue?: string | string[]): Set<string> => {
  const cohortFilters = parmValue?.toString().split("&").map((cohort) => decodeURI(decodeURI(cohort)));
  return new Set(cohortFilters?.filter((cohort) => cohort !== ""));
}

export const createQueryParamValue = (filters: Set<string>): string => {
  const paramValue = Array.from(filters).map((filter) => encodeURIComponent(filter)).join("&");
  return encodeURI(paramValue);
}