export const getFiltersFromQueryParam = (parmValue?: string | string[]): Set<string> => {
  const cohortFilters = parmValue?.toString().split("&").map((cohort) => decodeURI(decodeURI(cohort)));
  return new Set(cohortFilters);
}