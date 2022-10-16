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

export const practices: any = {
  bestPractices: 'best practices',
  methodology: 'methodology',
  notesOfCaution: 'notes of caution',
  tools: 'tools',
};

const practiceNameToKey: any = {};
Object.keys(practices).forEach(key => {
  practiceNameToKey[practices[key]] = key;
})

interface Props {
  filteredBestPractices: BestPractice[];
  filterSubCohorts: Set<string>;
  setFilterSubCohorts: Dispatch<SetStateAction<Set<string>>>;
  filterKeywords: Set<string>;
  setFilterKeywords: Dispatch<SetStateAction<Set<string>>>;
  filterPractices: Set<string>;
  setFilterPractices: Dispatch<SetStateAction<Set<string>>>;
}

const SecondaryFilters = ({
  filteredBestPractices,
  filterSubCohorts,
  setFilterSubCohorts,
  filterKeywords,
  setFilterKeywords,
  filterPractices,
  setFilterPractices,
}: Props) => {
  const availableSubCohorts = useMemo(() => {
    const subCohorts = new Set<string>();
    filteredBestPractices.forEach((bestPractice) =>
      bestPractice.subCohorts.forEach((subCohort) => subCohorts.add(subCohort))
    );
    return subCohorts;
  }, [filteredBestPractices]);

  const availableKeywords = useMemo(() => {
    const keywords = new Set<string>();
    filteredBestPractices.forEach((bestPractice) =>
      bestPractice.keywords.forEach((keyword) => keywords.add(keyword))
    );
    return keywords;
  }, [filteredBestPractices]);

  const subCohortIds = new Array<string>();
  Array.from(availableSubCohorts)?.map((subCohort) => {
    subCohortIds.push(subCohort.replace(/\s/g, ''));
  });

  const subCohortFilters = (
    <AutocompleteMultiSelect
      possibleValues={Array.from(availableSubCohorts)}
      chosenValues={Array.from(filterSubCohorts)}
      setFieldValue={(_: any, values: string[]) =>
        setFilterSubCohorts(new Set(values))
      }
      fieldName="Sub-cohorts"
      fieldTitle="Sub-cohorts"
      freeSolo={false}
      fullWidth={true}
    />
  );

  const keywordIds = new Array<string>();
  Array.from(availableKeywords)?.map((keyword) => {
    keywordIds.push(keyword.replace(/\s/g, ''));
  });

  const keywordFilters = (
    <AutocompleteMultiSelect
      possibleValues={Array.from(availableKeywords)}
      chosenValues={Array.from(filterKeywords)}
      setFieldValue={(_: any, values: string[]) =>
        setFilterKeywords(new Set(values))
      }
      fieldName="Keywords"
      fieldTitle="Keywords"
      freeSolo={false}
      fullWidth={true}
    />
  );

  const practiceKeys = Object.keys(practices);
  const practiceIds = new Array<string>();
  practiceKeys?.map((practice) => {
    practiceIds.push(practice.replace(/\s/g, ''));
  });

  const practiceFilters = (
    <AutocompleteMultiSelect
      possibleValues={Array.from(practiceKeys).map(val => practices[val])}
      chosenValues={Array.from(filterPractices).map(val => practices[val])}
      setFieldValue={(_: any, values: string[]) =>
        setFilterPractices(new Set(values.map(val => practiceNameToKey[val])))
      }
      fieldName="Content types"
      fieldTitle="Content types"
      freeSolo={false}
      fullWidth={true}
    />
  );

  filteredBestPractices.forEach((bp) => {
    console.log(bp.methodologyUsed);
  });

  return (
    <div className="flex flex-col pb-5 space-y-10" style={{ width: '40%' }}>
      {availableSubCohorts.size > 0 && (
        <div>
          <h2 className="pb-4 font-bold">Select sub-cohorts</h2>
          {subCohortFilters}
        </div>
      )}

      {availableKeywords.size > 0 && (
        <div>
          <h2 className="pb-4 font-bold">Select any relevant keywords</h2>
          {keywordFilters}
        </div>
      )}

      {practiceKeys.length > 0 && (
        <div>
          <h2 className="pb-4 font-bold">Select the types of content you want to see</h2>
          {practiceFilters}
        </div>
      )}
    </div>
  );
};

export default SecondaryFilters;
