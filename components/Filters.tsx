import { Dispatch, SetStateAction, useMemo } from "react";
import { BestPractice, Cohort } from "../shared/sharedTypes";

const toggleSetter: <T>(
  setter: Dispatch<SetStateAction<Set<T>>>
) => (value: T) => void = (setter) => (cohortId) => {
  setter((prev) => {
    const newSet = new Set(prev);

    if (newSet.has(cohortId)) {
      newSet.delete(cohortId);
    } else {
      newSet.add(cohortId);
    }

    return newSet;
  });
};

interface Props {
  cohorts: Cohort[];
  filterCohorts: Set<string>;
  setFilterCohorts: Dispatch<SetStateAction<Set<string>>>;
  onClick: () => void;
}

const Filters = ({
  cohorts,
  filterCohorts,
  setFilterCohorts,
  onClick
}: Props) => {
  const toggleCohort = toggleSetter<string>(setFilterCohorts);
  
  const cohortFilters = cohorts?.map((cohort) => (
    <div key={cohort.referenceName}>
      <input
        type="checkbox"
        checked={filterCohorts.has(cohort.referenceName)}
        onChange={() => toggleCohort(cohort.referenceName)}
        id={`checkbox-cohort-${cohort.referenceName}`}
      />{" "}
      <label htmlFor={`checkbox-cohort-${cohort.referenceName}`}>{cohort.name}</label>
    </div>
  ));

  return (
    <div className="flex flex-col space-y-10">
      <div>
        <h2 className="pb-4 font-bold">Cohorts (select any that are relevant to your research)</h2>
        <div className="grid grid-cols-3 gap-4">{cohortFilters}</div>
      </div>
      <div className="flex justify-center pt-32">
        <button className="px-4 py-2 font-semibold text-gray-800 border border-gray-800 rounded shadow bg-grey-800 hover:bg-gray-100 dark:border-white dark:text-white dark:hover:text-gray-800" onClick={onClick}>
          Find Best Practices
        </button>
      </div>
    </div>
  );
};

export default Filters;
