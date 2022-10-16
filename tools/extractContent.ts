const path = require("path");
const fs = require("fs/promises");
const yaml = require("yaml");
const {
  default: readExcelFile,
  readSheetNames,
  parseExcelDate,
} = require("read-excel-file/node");
const sha1 = require("sha1");

const fileName = "../framework/spreadsheet/Tool Content.xlsx";
const filePath = path.join(__dirname, fileName);

const writeFolder = path.join(__dirname, "../framework/content-researchers");

const schema = {
  "Paper Name": {
    prop: "paperName",
  },
  "Paper Link": {
    prop: "paperLink",
  },
  Cohorts: {
    prop: "cohorts",
    required: true,
  },
  "Sub-cohorts": {
    prop: "subCohorts",
  },
  Keywords: {
    prop: "keywords",
  },
  "Target Audience": {
    prop: "targetAudience",
  },
  Findings: {
    prop: "findings",
  },
  Summary: {
    prop: "summary",
  },
  Notes: {
    prop: "notes",
  },
  "Best Practices": {
    prop: "bestPractices",
  },
  "Methodology Used": {
    prop: "methodology",
  },
  "Tools Used": {
    prop: "tools",
  },
  Terminology: {
    prop: "terminology",
  },
  "Notes of Caution": {
    prop: "notesOfCaution",
  },
  "Related Papers": {
    prop: "relatedPapers",
  },
  "Publish Date": {
    prop: "publishDate",
  },
  "Submission Date": {
    prop: "submissionDate",
  },
};

const summariseFields = (fieldNames: string[], bestPracticesWithIds: any[]) => {
  const fieldLists = fieldNames.map((fieldName: string) =>
    Array.from(
      new Set(
        bestPracticesWithIds.flatMap(
          (bestPractice: any) => bestPractice[fieldName]
        ).filter(Boolean)
      )
    )
  );

  const returnValue: Record<string, string[]> = {};
  fieldNames.forEach((name: string, i) => {
    returnValue[name] = fieldLists[i];
  });

  return returnValue;
};

const writeBestPractices = async (bestPracticesWithIds: any[]) => {
  await Promise.all(
    bestPracticesWithIds.map(async (bestPractice: any) => {
      const yamlData = yaml.stringify(bestPractice);

      await fs.writeFile(
        path.join(writeFolder, "bestPractices", `${bestPractice.id}.yaml`),
        yamlData
      );
    })
  );
};

const writeMetadata = async (metadata: any) => {
  const yamlData = yaml.stringify(metadata);

  await fs.writeFile(path.join(writeFolder, "metadata", `metadata.yaml`), yamlData);
};

const readUgc: () => Promise<any[]> = async () => {
  const tPath = path.join(__dirname, '../framework/content-user/bestPractices');

  const filenames = await fs.readdir(tPath);
  console.log(filenames);

  const data = await Promise.all(filenames.map(async (filename: string) => (await fs.readFile(path.join(tPath, filename))).toString()));

  return data.map(file => yaml.parse(file));
}

const run = async () => {
  const sheetNames = await readSheetNames(filePath);

  const bestPracticesPerSheet = await Promise.all(
    sheetNames.map(async (sheetName: string, i: number) => {
      const data = await readExcelFile(filePath, { sheet: sheetName, schema });

      return data;
    })
  );

  const bestPractices = bestPracticesPerSheet
    .flatMap((sheet: any) => sheet.rows);

  const bestPracticesWithIds = bestPractices.map((bestPractice: any) => ({
    ...bestPractice,
    cohorts: bestPractice.cohorts.toLowerCase().split(", "),
    subCohorts: bestPractice.subCohorts?.toLowerCase().split(", ") ?? [],
    keywords: bestPractice.keywords?.toLowerCase().split(", ") ?? [],
    id: sha1(JSON.stringify(bestPractice)).substring(0, 8),
  }));

  await fs.mkdir(writeFolder, { recursive: true });
  await fs.mkdir(path.join(writeFolder, 'bestPractices'), { recursive: true });
  await fs.mkdir(path.join(writeFolder, 'metadata'), { recursive: true });
  await fs.mkdir(path.join(writeFolder, 'cohorts'), { recursive: true });

  await writeBestPractices(bestPracticesWithIds);

  const ugcBestPracticesWithIds = await readUgc();

  console.log(ugcBestPracticesWithIds);

  const metadata = summariseFields(
    ["cohorts", "subCohorts", "keywords"],
    [...bestPracticesWithIds, ...ugcBestPracticesWithIds],
  );

  await writeMetadata(metadata);
};

run();
