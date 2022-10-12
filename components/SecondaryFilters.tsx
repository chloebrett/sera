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

export const practices: any = {
  bestPractices: "best practices",
  methodology: "methodology",
  notesOfCaution: "notes of caution",
  tools: "tools"
};

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
  setFilterPractices
}: Props) => {
  const toggleSubCohort = toggleSetter<string>(setFilterSubCohorts);
  const toggleKeyword = toggleSetter<string>(setFilterKeywords);
  const togglePractice = toggleSetter<string>(setFilterPractices);

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
  
  const subCohortIds = new Array<string>();
  Array.from(availableSubCohorts)?.map((subCohort) => {subCohortIds.push(subCohort.replace(/\s/g,''))});
  const subCohortFilters = Array.from(availableSubCohorts)?.map((subCohort, index) => (
    <div key={subCohort}>
      <input
        type="checkbox"
        checked={filterSubCohorts.has(subCohort)}
        onChange={() => toggleSubCohort(subCohort)}
        id={`checkbox-subcohort-${subCohortIds[index]}`}
      />{" "}
      <label htmlFor={`checkbox-subcohort-${subCohortIds[index]}`}>{subCohort} ({filteredBestPractices.filter((bp) => (bp.subCohorts.includes(subCohort))).length})</label>
    </div>
  ));

  const keywordIds = new Array<string>();
  Array.from(availableKeywords)?.map((keyword) => {keywordIds.push(keyword.replace(/\s/g,''))});
  const keywordFilters = Array.from(availableKeywords)?.map((keyword, index) => (
    <div key={keyword}>
      <input
        type="checkbox"
        checked={filterKeywords.has(keyword)}
        onChange={() => toggleKeyword(keyword)}
        id={`checkbox-keyword-${keywordIds[index]}`}
      />{" "}
      <label htmlFor={`checkbox-keyword-${keywordIds[index]}`}>{keyword} ({filteredBestPractices.filter((bp) => (bp.keywords.includes(keyword))).length})</label>
    </div>
  ));

  const practiceKeys = Object.keys(practices);
  const practiceIds = new Array<string>();
  practiceKeys?.map((practice) => {practiceIds.push(practice.replace(/\s/g,''))});
  const practiceFilters = practiceKeys?.map((practiceKey: string, index) => (
    <div key={practiceKey}>
      <input
        type="checkbox"
        checked={filterPractices.has(practiceKey)}
        onChange={() => togglePractice(practiceKey)}
        id={`checkbox-keyword-${practiceIds[index]}`}
      />{" "}
      <label htmlFor={`checkbox-keyword-${practiceIds[index]}`}>{practices[practiceKey]} ({filteredBestPractices.filter((bp) => practiceKey in bp).length})</label>
      {filteredBestPractices.filter((bp) => console.log(practiceKey, practiceKey in bp))}
    </div>
  ));

  filteredBestPractices.forEach((bp) => {console.log(bp.methodologyUsed)})

  return (
    <div className="flex flex-col pb-5 space-y-10">
      {subCohortFilters.length > 0 && 
        <div>
          <h2 className="pb-4 font-bold">Sub-cohorts</h2>
          <div className="grid grid-cols-3 gap-4">{subCohortFilters}</div>
        </div>}

      {keywordFilters.length > 0 && 
        <div>
          <h2 className="pb-4 font-bold">Keywords</h2>
          <div className="grid grid-cols-3 gap-4">{keywordFilters}</div>
        </div>}

      {practiceFilters.length > 0 && 
        <div>
          <h2 className="pb-4 font-bold">Practices</h2>
          <div className="grid grid-cols-3 gap-4">{practiceFilters}</div>
        </div>}        
    </div>
  );
};

export default SecondaryFilters;
