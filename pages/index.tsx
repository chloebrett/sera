import type { NextPage } from "next";
import { useEffect, useMemo, useRef, useState } from "react";
import content from '../framework/compiledContent';
import { Layout } from "../layouts/Layout";
import Filters from "../components/Filters";
import Results from "../components/Results";
import SecondaryFilters from "../components/SecondaryFilters";




const Home: NextPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSubFilters, setShowSubFilters] = useState(false);
  const [filterCohorts, setFilterCohorts] = useState<Set<string>>(new Set());
  const filterRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const [filterSubCohorts, setFilterSubCohorts] = useState<Set<string>>(
    new Set()
  );
  const [filterKeywords, setFilterKeywords] = useState<Set<string>>(new Set());

  const filteredBestPractices = useMemo(
    () =>
      content?.bestPractices?.filter(
        ({ cohorts, subCohorts, keywords }) =>
          cohorts.some((cohort) => filterCohorts.has(cohort)) ||
          subCohorts.some((subCohort) => filterSubCohorts.has(subCohort)) ||
          keywords.some((keyword) => filterKeywords.has(keyword))
      ),
    [filterCohorts, filterSubCohorts, filterKeywords]
  );

  useEffect(() => {if (showFilters && filterRef.current) {
    filterRef.current.scrollIntoView({ behavior: "smooth" })
  }}, [showFilters, filterRef]);

  useEffect(() => {if (showResults && resultsRef.current) {
    resultsRef.current.scrollIntoView({ behavior: "smooth" })
  }}, [showResults, resultsRef]);

  return (
    <Layout title="Persona | Software Engineering User Research Tool">
      <main className="flex-col flex-1 pb-8">
       <div className="flex flex-col items-center justify-center pb-36 space-y-14 md:space-y-44 min-h-[calc(100vh-56px)]">
        <h1 className="text-6xl font-bold">Persona</h1>

        <p className="max-w-3xl text-xl text-center">
          Persona is a tool to help <b>software engineering researchers</b>{" "}
          better understand the diverse cohorts they are studying, and to share
          best practices for conducting research with various user cohorts.
        </p>

        <button className="px-4 py-2 font-semibold text-gray-100 border border-gray-100 rounded shadow bg-grey-100 hover:bg-gray-800" onClick={() => setShowFilters(true)}>Get Started</button>

        </div>

        {showFilters && (
          <div className="flex flex-col items-center justify-center min-h-screen pt-44 pb-36" ref={filterRef}>
            <Filters
              filteredBestPractices={filteredBestPractices}
              cohorts={content.cohorts}
              filterCohorts={filterCohorts}
              setFilterCohorts={setFilterCohorts}
              filterSubCohorts={filterSubCohorts}
              setFilterSubCohorts={setFilterSubCohorts}
              filterKeywords={filterKeywords}
              setFilterKeywords={setFilterKeywords}
              onClick={() => setShowResults(true)}
            />
          </div>
        )}

        {showResults && (
          <div className="flex flex-col items-center justify-center min-h-screen pt-44" ref={resultsRef}>
            <p className="pb-5 text-3xl font-bold text-center">Results</p>
            <button className="pb-5" onClick={() => setShowSubFilters((curr) => !curr)}>
              {showSubFilters ? "Hide sub filters" : "Show sub filters"}
            </button>
            {showSubFilters && <SecondaryFilters 
              filteredBestPractices={filteredBestPractices}
              filterSubCohorts={filterSubCohorts}
              setFilterSubCohorts={setFilterSubCohorts}
              filterKeywords={filterKeywords}
              setFilterKeywords={setFilterKeywords}
            />}
            <div>
              <Results
                filteredBestPractices={filteredBestPractices}
              />
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Home;
