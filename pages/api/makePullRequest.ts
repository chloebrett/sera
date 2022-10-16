import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import sha1 from 'sha1';
import base64 from 'base-64';
import yaml from 'yaml';

const API_BASE = 'https://api.github.com';
const REPO_BASE = `${API_BASE}/repos/chloebrett/sera`;

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const values = request.body.values as any;

  console.log(request.body);

  const authConfig = {
    auth: {
      username: 'sera-monash-bot',
      password: process.env.PERSONAL_ACCESS_TOKEN ?? '',
    },
  };

  // Get the sha ref of the top commit on `main` right now
  const shaResp = await axios.get(`${REPO_BASE}/git/ref/heads/main`);

  const { sha: topCommitSha } = shaResp.data.object;

  const contentYamlNoIds = yaml.stringify(values);
  const contentSha = sha1(contentYamlNoIds).substring(0, 8);

  const branchName = `user-submitted-content-${contentSha}`;

  const contentYaml = yaml.stringify({ ...values, id: contentSha });

  console.log('sr', shaResp, branchName, contentYaml, contentSha, topCommitSha);

   // Create a new branch
   const branchCreateResp = await axios.post(`${API_BASE}/repos/chloebrett/sera/git/refs`, {
    ref: `refs/heads/${branchName}`,
    sha: topCommitSha,
  }, authConfig);

  console.log('bcr', branchCreateResp);

  const content = base64.encode(contentYaml);

  // Create the file
  const fileCreateResp = await axios.put(
    `${REPO_BASE}/contents/framework/content-user/bestPractices/${contentSha}.yaml`,
    {
      message: 'Add user-generated content',
      committer: {
        name: 'User Generated Content Submission',
        email: 'noreply@github.com',
      },
      content,
      branch: branchName,
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
      head: branchName,
      base: 'main',
    },
    authConfig
  );

  console.log('pcr', prCreateResp);

  const { html_url: prUrl } = prCreateResp.data;

  response.status(200).json({
    prUrl,
  });
}
