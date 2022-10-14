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
  filteredBestPractices: BestPractice[];
  cohorts: Cohort[];
  filterCohorts: Set<string>;
  setFilterCohorts: Dispatch<SetStateAction<Set<string>>>;
  filterSubCohorts: Set<string>;
  setFilterSubCohorts: Dispatch<SetStateAction<Set<string>>>;
  filterKeywords: Set<string>;
  setFilterKeywords: Dispatch<SetStateAction<Set<string>>>;
  onClick: () => void;
}

const Filters = ({
  filteredBestPractices,
  cohorts,
  filterCohorts,
  setFilterCohorts,
  filterSubCohorts,
  setFilterSubCohorts,
  filterKeywords,
  setFilterKeywords,
  onClick
}: Props) => {
  const toggleCohort = toggleSetter<string>(setFilterCohorts);
  const toggleSubCohort = toggleSetter<string>(setFilterSubCohorts);
  const toggleKeyword = toggleSetter<string>(setFilterKeywords);

  const availableSubCohorts = useMemo(() =>  {
    const subCohorts = new Set<string>();
    filteredBestPractices.forEach((bestPractice) => bestPractice.subCohorts.forEach((subCohort) => subCohorts.add(subCohort)));
    return subCohorts;
  }, [filteredBestPractices]);

  const availableKeywords = useMemo(() =>  {
    const keywords = new Set<string>();
    filteredBestPractices.forEach((bestPractice) => bestPractice.keywords.forEach((keyword) => keywords.add(keyword)));
    return keywords;
  }, [filteredBestPractices]);
  
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

  const subCohortFilters = Array.from(availableSubCohorts)?.map((subCohort) => (
    <div key={subCohort}>
      <input
        type="checkbox"
        checked={filterSubCohorts.has(subCohort)}
        onChange={() => toggleSubCohort(subCohort)}
        id={`checkbox-subcohort-${subCohort}`}
      />{" "}
      <label htmlFor={`checkbox-subcohort-${subCohort}`}>{subCohort}</label>
    </div>
  ));

  const keywordFilters = Array.from(availableKeywords)?.map((keyword) => (
    <div key={keyword}>
      <input
        type="checkbox"
        checked={filterKeywords.has(keyword)}
        onChange={() => toggleKeyword(keyword)}
        id={`checkbox-keyword-${keyword}`}
      />{" "}
      <label htmlFor={`checkbox-keyword-${keyword}`}>{keyword}</label>
    </div>
  ));

  return (
    <div className="flex flex-col space-y-10">
      <div>
        <h2 className="pb-4 font-bold">Cohorts (select any that are relevant to your research)</h2>
        <div className="grid grid-cols-3 gap-4">{cohortFilters}</div>
        
      </div>

      {/* {subCohortFilters.length > 0 && <div>
        <h2 className="pb-4 font-bold">Sub-cohorts</h2>
        <div className="grid grid-cols-3 gap-4">{subCohortFilters}</div>
      </div>}

      {keywordFilters.length > 0 && <div>
        <h2 className="pb-4 font-bold">Keywords</h2>
        <div className="grid grid-cols-3 gap-4">{keywordFilters}</div>
      </div>} */}

      <div className="flex justify-center pt-32">
      <button className="px-4 py-2 font-semibold text-gray-800 border border-gray-800 rounded shadow bg-grey-800 hover:bg-gray-100" onClick={onClick}>Find Best Practices</button>
      </div>
      
    </div>
  );
};

export default Filters;
