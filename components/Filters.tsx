import { Dispatch, SetStateAction } from "react";
import { Cohort } from "../shared/sharedTypes";

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
  subCohorts: string[];
  keywords: string[];
  filterCohorts: Set<string>;
  setFilterCohorts: Dispatch<SetStateAction<Set<string>>>;
  filterSubCohorts: Set<string>;
  setFilterSubCohorts: Dispatch<SetStateAction<Set<string>>>;
  filterKeywords: Set<string>;
  setFilterKeywords: Dispatch<SetStateAction<Set<string>>>;
  onClick: () => void;
}

const Filters = ({
  cohorts,
  subCohorts,
  keywords,
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

  const subCohortFilters = subCohorts?.map((subCohort) => (
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

  const keywordFilters = keywords?.map((keyword) => (
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

      <div>
        <h2 className="pb-4 font-bold">Sub-cohorts</h2>
        <div className="grid grid-cols-3 gap-4">{subCohortFilters}</div>
      </div>

      <div>
        <h2 className="pb-4 font-bold">Keywords</h2>
        <div className="grid grid-cols-3 gap-4">{keywordFilters}</div>
      </div>

      <div className="flex justify-center pt-32">
      <button onClick={onClick}>Find Best Practices</button>
      </div>
      
    </div>
  );
};

export default Filters;
