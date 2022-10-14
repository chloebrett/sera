import axios from 'axios';
import useLocalStorage from 'use-local-storage';
import { Formik } from 'formik';
import {
  fieldNames,
  humanReadableFieldNames,
} from '../components/BestPracticeDisplay';
import { TextField } from '@mui/material';
import { Layout } from '../layouts/Layout';
import { useState } from 'react';
const base64 = require('base-64');
const yaml = require('yaml');
const sha1 = require('sha1');
import content from '../framework/compiledContent';
import AutocompleteMultiSelect from '../components/AutocompleteMultiSelect';

const sleep = async (secs: number) => new Promise((resolve) => setTimeout(resolve, secs * 1000));

const displayInput = (
  fieldName: string,
  handleChange: any,
  handleBlur: any,
  values: any,
  setFieldValue: any,
) => {
  const largeFields = [
    'findings',
    'summary',
    'notes',
    'bestPractices',
    'methodology',
    'tools',
    'terminology',
    'notesOfCaution',
  ];

  // Maps field names to the default dropdown values
  const autocompleteFields: Record<string, string[]> = content.metadata[0];

  if (Object.keys(autocompleteFields).includes(fieldName)) {
    return (
      <div key={fieldName}>
        <AutocompleteMultiSelect
          possibleValues={autocompleteFields[fieldName]}
          chosenValues={values[fieldName as keyof typeof values]}
          setFieldValue={setFieldValue}
          fieldName={fieldName}
          fieldTitle={
            humanReadableFieldNames[
              fieldName as keyof typeof humanReadableFieldNames
            ]
          }
        />
      </div>
    );
  }

  return (
    <div key={fieldName}>
      <TextField
        sx={{
          margin: '10px',
          width: 'calc(50% - 20px)',
          color: 'black',
          background: 'white',
        }}
        key={fieldName}
        type="text"
        multiline
        minRows={largeFields.includes(fieldName) ? 5 : 1}
        placeholder={
          humanReadableFieldNames[
            fieldName as keyof typeof humanReadableFieldNames
          ]
        }
        name={fieldName}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[fieldName as keyof typeof values]}
      />
    </div>
  );
};

const API_BASE = 'https://api.github.com';
const REPO_BASE = `${API_BASE}/repos/chloebrett/sera`;

enum AsyncState {
  READY,
  LOADING,
  SUCCESS,
  ERROR,
}

const SubmitContent = ({}) => {
  const [authData] = useLocalStorage<{ access_token: string }>('githubAuth', {
    access_token: '',
  });

  const [asyncState, setAsyncState] = useState<AsyncState>(AsyncState.READY);

  const [pullRequestUrl, setPullRequestUrl] = useState<string>('');

  const trySubmit = async (values: any) => {
    try {
      setAsyncState(AsyncState.LOADING);

      await doSubmit(values);

      setAsyncState(AsyncState.SUCCESS);
    } catch (err) {
      setAsyncState(AsyncState.ERROR);
    }
  };

  const doSubmit = async (values: any) => {
    const { access_token } = authData;

    const authConfig = {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${access_token}`,
      },
    };

    // Get the sha ref of the top commit on `main` right now
    const shaResp = await axios.get(`${REPO_BASE}/git/ref/heads/main`);

    const { sha: topCommitSha } = shaResp.data.object;

    const contentYaml = yaml.stringify(values);
    const contentSha = sha1(contentYaml).substring(0, 8);

    const branchName = `user-submitted-content-${contentSha}`;

    console.log(
      'sr',
      shaResp,
      branchName,
      contentYaml,
      contentSha,
      topCommitSha
    );

    // Create a fork of the PR so that we can write a file to it
    const forkCreateResp = await axios.post(
      `${REPO_BASE}/forks`,
      {
        default_branch_only: true
      },
      authConfig
    );

    console.log('forkcr', forkCreateResp);

    const forkRepo = forkCreateResp.data.full_name;
    const forkOwner = forkCreateResp.data.owner.login;

    const content = base64.encode(contentYaml);

    // Hack - wait a few seconds for the repo to be forked.
    // 5 seconds should do
    await sleep(5);

    // Create the file
    const fileCreateResp = await axios.put(
      `${API_BASE}/${forkRepo}/contents/framework/content-user/bestPractices/${contentSha}.yaml`,
      {
        message: 'Add user-generated content',
        committer: {
          name: 'User Generated Content Submission',
          email: 'noreply@github.com',
        },
        content,
        branch: 'main',
      },
      authConfig
    );

    console.log('filecr', fileCreateResp);

    // Create the PR
    const prCreateResp = await axios.post(
      `${REPO_BASE}/pulls`,
      {
        owner: 'chloebrett',
        repo: 'sera',
        title: `User submission: ${values.paperName}`,
        body: 'Automated PR for user-generated content',
        head: `${forkOwner}:main`,
        base: 'main',
      },
      authConfig
    );

    console.log('pcr', prCreateResp);

    const { html_url: prUrl } = prCreateResp.data;

    setPullRequestUrl(prUrl);
  };

  if (asyncState === AsyncState.LOADING) {
    return <Layout title="SERA | Submit Content">Submitting form...</Layout>;
  }

  if (asyncState === AsyncState.SUCCESS) {
    return (
      <Layout title="SERA | Submit Content">
        <h1>Success!</h1>
        <div>
          The data was successfully submitted as a pull request on the
          repository!
        </div>
        <a
          href={pullRequestUrl}
          style={{ textDecoration: 'underline' }}
          target="_BLANK"
          rel="noreferrer"
        >
          Click here to view the pull request.
        </a>
      </Layout>
    );
  }

  return (
    <Layout title="SERA | Submit Content">
      {asyncState === AsyncState.ERROR && (
        <div>
          There was an error with the data submission. Please try again...
        </div>
      )}
      <div className="w-screen">
        <h1>Submit a best practice</h1>
        <Formik
          initialValues={{
            paperName: '',
            paperLink: '',
            cohorts: [],
            subCohorts: [],
            keywords: [],
            targetAudience: '',
            findings: '',
            summary: '',
            notes: '',
            bestPractices: '',
            methodologyUsed: '',
            toolsUsed: '',
            terminology: '',
            notesOfCaution: '',
            relatedPapers: '',
          }}
          onSubmit={trySubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              {fieldNames.map((fieldName) =>
                displayInput(fieldName, handleChange, handleBlur, values, setFieldValue)
              )}
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default SubmitContent;
