import { Dispatch, SetStateAction, useMemo } from 'react';
import { BestPractice, Cohort } from '../shared/sharedTypes';
import AutocompleteMultiSelect from './AutocompleteMultiSelect';

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
  onClick,
}: Props) => {
  const cohortFilters = (
    <AutocompleteMultiSelect
      possibleValues={cohorts.map(cohort => cohort.referenceName)}
      chosenValues={Array.from(filterCohorts)}
      setFieldValue={(_: any, values: string[]) => setFilterCohorts(new Set(values))}
      fieldName="Cohorts"
      fieldTitle="Cohorts"
      freeSolo={false}
      fullWidth={true}
    />
  );

  return (
    <div className="flex flex-col space-y-10">
      <div>
        <h2 className="pb-4 font-bold">
          Select any cohorts that are relevant to your research
        </h2>
        <div style={{ width: '100%' }}>{cohortFilters}</div>
      </div>
      <div className="flex justify-center pt-32">
        <button
          className="px-4 py-2 font-semibold text-gray-800 border border-gray-800 rounded shadow bg-grey-800 hover:bg-gray-100 dark:border-white dark:text-white dark:hover:text-gray-800"
          onClick={onClick}
        >
          Find Best Practices
        </button>
      </div>
    </div>
  );
};

export default Filters;
