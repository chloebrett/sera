/**
 * Compile content files to JSON so they can be imported normally.
 * This is run from ts-node
 */

const fs = require("fs");
const path = require("path");
const yaml = require("yaml");

// import fs from 'fs';
// import path from 'path';
// import yaml from 'yaml';

const ORIGINAL_CONTENT_FOLDER = path.join(__dirname, "../framework/content-researchers/");
const UGC_FOLDER = path.join(__dirname, "../framework/content-user/");
const COMPILED_CONTENT_FOLDER = path.join(
  __dirname,
  "../framework/content-compiled"
);

function parseYaml(folder: string, relativePath: string): any {
  const input = fs
    .readFileSync(path.join(folder, relativePath))
    .toString();

  return yaml.parse(input);
}

function generatePathsList(dirPath: string) {
  const contents = fs
    .readdirSync(dirPath)
    .map((relativePath: string) => path.join(dirPath, relativePath));

  let pathsList: string[] = [];

  for (const dirOrFile of contents) {
    if (fs.statSync(dirOrFile).isDirectory()) {
      pathsList = pathsList.concat(generatePathsList(dirOrFile));
    } else {
      pathsList.push(dirOrFile);
    }
  }

  console.log('pl', pathsList);

  return pathsList;
}

function withoutExtension(path: string) {
  return path.split("." + extensionOf(path))[0];
}

function extensionOf(path: string) {
  return path.split(".")[path.split(".").length - 1];
}

function categoryFrom(path: string) {
  return path.split("/")[path.split("/").length - 2];
}

function nameFrom(path: string) {
  return path.split("/")[path.split("/").length - 1];
}

function relativePathOf(folder: string, path: string) {
  return path.split(folder)[1];
}

function firstUpper(str: string) {
  return str.substring(0, 1).toUpperCase() + str.substring(1);
}

function categoryAndNameFrom(path: string) {
  const pathNoExt = withoutExtension(path);
  const category = categoryFrom(pathNoExt);
  const name = nameFrom(pathNoExt);
  return category + firstUpper(name);
}

function compile() {
  if (fs.statSync(COMPILED_CONTENT_FOLDER, { throwIfNoEntry: false })) {
    fs.rmdirSync(COMPILED_CONTENT_FOLDER, { recursive: true });
  }
  fs.mkdirSync(COMPILED_CONTENT_FOLDER);

  const outputObject: Record<string, any> = {};

  [ORIGINAL_CONTENT_FOLDER, UGC_FOLDER].forEach(folder => {
    const paths = generatePathsList(folder);
  
    const relativePaths = paths.map(path => relativePathOf(folder, path));

    console.log('rp', relativePaths);
  
    for (const path of relativePaths) {
      console.log(path);
      const pathSplit = path.split('/');
      const innerFolder = pathSplit[0];
      const filename = withoutExtension(pathSplit[1]);
  
      let arr = outputObject[innerFolder];
  
      if (arr === undefined) {
          outputObject[innerFolder] = [];
          arr = outputObject[innerFolder];
      }
  
      const parsed = {
          ...parseYaml(folder, path),
          id: filename,
      };
  
      arr.push(parsed);
    }
  })

  fs.writeFileSync(
    path.join(COMPILED_CONTENT_FOLDER, "content.json"),
    JSON.stringify(outputObject)
  );
}

compile();

module.exports = {};
