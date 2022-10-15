import type { NextPage } from 'next';
import { useEffect, useMemo, useRef, useState } from 'react';
import content from '../framework/compiledContent';
import { Layout } from '../layouts/Layout';
import Filters from '../components/Filters';
import Results from '../components/Results';
import SecondaryFilters from '../components/SecondaryFilters';
import SortDropDown from '../components/SortDropdown';
import Router, { useRouter } from 'next/router'
import {getFiltersFromQueryParam} from '../tools/utils';

const Home: NextPage = () => {
  const router = useRouter()
  const [showFilters, setShowFilters] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSubFilters, setShowSubFilters] = useState(false);
  const [filterCohorts, setFilterCohorts] = useState<Set<string>>(new Set());
  const filterRef = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const [filterSubCohorts, setFilterSubCohorts] = useState<Set<string>>(new Set());
  const [filterKeywords, setFilterKeywords] = useState<Set<string>>(new Set());
  const [filterPractices, setFilterPractices] = useState<Set<string>>(new Set());

  useEffect (() => {
    if(!router.isReady) return;

    const { cohortFilters, subCohortsFilters, keywordFilters, practiceFilters } = router.query;
    const uriCohortFilters = getFiltersFromQueryParam(cohortFilters);
    const uriSubCohortsFilters = getFiltersFromQueryParam(subCohortsFilters);
    const uriKeywordFilters = getFiltersFromQueryParam(keywordFilters);
    const uriPracticeFilters = getFiltersFromQueryParam(practiceFilters);

    setFilterCohorts(uriCohortFilters);
    setFilterSubCohorts(uriSubCohortsFilters);
    setFilterKeywords(uriKeywordFilters);
    setFilterPractices(uriPracticeFilters);

    if (cohortFilters && cohortFilters.length > 0) {
      setShowFilters(true);
      setShowResults(true);
    }
  }, [router])

  // Add or remove filters to URL query params whenever the filters change
  const updateUriParams = () => {
    const cohortFilterQuery = Array.from(filterCohorts).map((cohort) => encodeURIComponent(cohort)).join("&");
    const subCohortFilterQuery = Array.from(filterSubCohorts).map((subCohort) => encodeURIComponent(subCohort)).join("&");
    const keywordFilterQuery = Array.from(filterKeywords).map((cohort) => encodeURIComponent(cohort)).join("&");
    Router.push({
      query: { 
        cohortFilters: encodeURI(cohortFilterQuery),
        subCohortsFilters: encodeURI(subCohortFilterQuery),
        keywordFilters: encodeURI(keywordFilterQuery),
      },
    }, undefined, { scroll: false });
  }

  const filteredBestPractices = useMemo(
    () =>
      content?.bestPractices?.filter(
        (bp) =>
          bp.cohorts.some((cohort) => filterCohorts.has(cohort)) &&
          ((filterSubCohorts.size == 0 || bp.subCohorts.some((subCohort) => filterSubCohorts.has(subCohort))) &&
            (filterKeywords.size == 0 || bp.keywords.some((keyword) => filterKeywords.has(keyword))) &&
            (filterPractices.size == 0 || Array.from(filterPractices).some((practice) => practice in bp)))
      ),
    [filterCohorts, filterSubCohorts, filterKeywords, filterPractices]
  );
  const filteredCohort = content?.bestPractices?.filter(
    ({ cohorts }) =>
      cohorts.some((cohort) => filterCohorts.has(cohort))
  );

  useEffect(() => {
    if (showFilters && filterRef.current) {
      filterRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showFilters, filterRef]);

  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showResults, resultsRef]);

  return (
    <Layout title="SERA | Software Engineering Research Assistant">
      <main className="flex-col flex-1 pb-8">
        <div className="flex flex-col items-center justify-center pb-36 space-y-14 md:space-y-44 min-h-[calc(100vh-56px)]">
          <h1 className="text-6xl font-bold">SERA</h1>

          <p className="max-w-3xl text-xl text-center">
            SERA (Software Engineering Research Assistant) is a tool to help <b>human-centric software engineering researchers</b>{' '}
            better understand the diverse cohorts they are studying, and to
            share best practices for conducting research with various user
            cohorts.
          </p>

          <button className="px-4 py-2 font-semibold text-gray-800 border border-gray-800 rounded shadow bg-grey-800 hover:bg-gray-100 dark:border-white dark:text-white dark:hover:text-gray-800" onClick={() => setShowFilters(true)}>Get Started</button>

        </div>

        {showFilters && (
          <div
            className="flex flex-col items-center justify-center min-h-screen pt-44 pb-36"
            ref={filterRef}
          >
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
          <div
            className="flex flex-col items-center justify-center min-h-screen pt-44"
            ref={resultsRef}
          >
            <p className="pb-5 text-3xl font-bold text-center">Results</p>
            <button
              className="px-4 py-2 mb-5 font-semibold text-gray-800 border border-gray-800 rounded shadow bg-grey-800 hover:bg-gray-100 dark:border-white dark:text-white dark:hover:text-gray-800"
              onClick={() => setShowSubFilters((curr) => !curr)}
            >
              {showSubFilters ? 'Hide sub filters' : 'Show sub filters'}
            </button>
            {showSubFilters &&
              <SecondaryFilters
                filteredBestPractices={filteredBestPractices}
                filterSubCohorts={filterSubCohorts}
                setFilterSubCohorts={setFilterSubCohorts}
                filterKeywords={filterKeywords}
                setFilterKeywords={setFilterKeywords}
                filterPractices={filterPractices}
                setFilterPractices={setFilterPractices}
              />}
            <div className="pb-5">
              <SortDropDown />
            </div>

            <Results
              filteredBestPractices={filteredBestPractices}
            />
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Home;
