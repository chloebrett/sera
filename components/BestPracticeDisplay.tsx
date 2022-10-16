import { BestPractice } from "../shared/sharedTypes";
import Router from "next/router";
import styles from "../styles/Results.module.css";
import AddLinkIcon from '@mui/icons-material/AddLink';
import DoneIcon from '@mui/icons-material/Done';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import Chip from "@mui/material/Chip";
import useLocalStorage from "use-local-storage";
import { useState } from "react";

export const fieldNames = [
  "paperName",
  "paperLink",
  "cohorts",
  "subCohorts",
  "keywords",
  "targetAudience",
  "findings",
  "summary",
  "notes",
  "bestPractices",
  "methodology",
  "tools",
  "terminology",
  "notesOfCaution",
  "relatedPapers",
];

export const humanReadableFieldNames = {
  paperName: "Paper name",
  paperLink: "Link to paper",
  cohorts: "Cohorts",
  subCohorts: "Sub-cohorts",
  keywords: "Keywords",
  targetAudience: "Target audience",
  findings: "Findings",
  summary: "Summary",
  notes: "Notes",
  bestPractices: "Best practices",
  methodology: "Methodology used",
  tools: "Tools used",
  terminology: "Terminology",
  notesOfCaution: "Notes of caution",
  relatedPapers: "Related papers",
};

const createFilterUri = (cohorts: string[], field: string, value: string) => {
  const cohortFilters = cohorts.map((filter) => encodeURIComponent(filter)).join("&");

  switch (field) {
    case "cohorts":
      return `?cohortFilters=${encodeURIComponent(value)}`;
    case "subCohorts":
      return `?cohortFilters=${encodeURI(cohortFilters)}&subCohortsFilters=${encodeURIComponent(value)}`;
    case "keywords":
      return `?cohortFilters=${encodeURI(cohortFilters)}&keywordFilters=${encodeURIComponent(value)}`;
  }
}

const displayField = (
  fieldData: string | string[] | undefined,
  fieldName: string,
  cohorts: string[]
) => {
  if (fieldName === "paperLink") {
    return (
      <a
        href={fieldData as string}
        style={{ textDecoration: "underline" }}
        target="_BLANK"
        rel="noreferrer"
      >
        {fieldData}
      </a>
    );
  }

  if (fieldData === undefined) {
    return "[none]";
  } else if (Array.isArray(fieldData)) {
    return fieldData.map((name: string) => <div key={name} className="inline pr-1"><Chip onClick={() => Router.push(`/${createFilterUri(cohorts, fieldName, name)}`)} label={name} /></div>);
  } else {
    return <pre className="font-sans whitespace-pre-wrap">{fieldData}</pre>;
  }
};

interface Props {
  bestPractice: BestPractice;
}

const BestPracticeDisplay = ({ bestPractice }: Props) => {
  const [favourites, setFavourites] = useLocalStorage(
    "favourited-best-practices",
    {}
  );

  const toggleFavourited = (bestPracticeId: string) =>
    setFavourites((prev) => ({
      ...prev,
      [bestPracticeId]:
        !(prev ?? {})[bestPracticeId as keyof typeof prev] ?? true,
    }));

  const isFavourited = (bestPracticeId: string) =>
    bestPracticeId in favourites &&
    favourites[bestPracticeId as keyof typeof favourites] === true;

  const originalCopyElement = { "text": "Copy Page Link", "icon": <AddLinkIcon /> };
  const [copyElement, setCopyElement] = useState(originalCopyElement);
  const getLink = () => {
    navigator.clipboard.writeText(document.URL);
    setCopyElement({ "text": "Copied to Clipboard", "icon": <DoneIcon /> });
    setTimeout(() => {
      setCopyElement(originalCopyElement);
    }, 2000);
  }

  if (bestPractice === undefined) {
    return null;
  }

  return (
    <div className={styles.bestPractice} key={bestPractice.id}>
      <div className="flex">
        <button className="pr-5" onClick={() => toggleFavourited(bestPractice.id)}>
          {isFavourited(bestPractice.id) ? <div><StarIcon />Unfavourite</div> : <div><StarOutlineIcon />Favourite</div>}
        </button>
        <a className="pr-3 hover:cursor-pointer" onClick={() => getLink()}>
          {copyElement.icon}<div className="inline pl-1">{copyElement.text}</div>
        </a>
      </div>
      {fieldNames
        .filter(
          (fieldName: string) =>
            bestPractice[fieldName as keyof typeof bestPractice] !==
            undefined &&
            JSON.stringify(
              bestPractice[fieldName as keyof typeof bestPractice]
            ) !== "[]"
        )
        .map((fieldName: string) => (
          <div key={`best-practice-${bestPractice.id}-${fieldName}`}>
            <h3 className="pt-5 font-bold">
              {
                humanReadableFieldNames[
                fieldName as keyof typeof humanReadableFieldNames
                ]
              }
            </h3>
            {displayField(
              bestPractice[fieldName as keyof typeof bestPractice],
              fieldName,
              bestPractice.cohorts
            )}
          </div>
        ))}
    </div>
  );
};

export default BestPracticeDisplay;
