const { Octokit, App, Action } = require("octokit");
const {AssetCache} = require("@11ty/eleventy-cache-assets");
const debug = require("debug")("EleventyGithub");

const getIssues = async ({ key, owner, repo }) => {
  let asset = new AssetCache(`${owner}_${repo}`, '.');

  let issues = null

  if(asset.isCacheValid("1d")) {
    issues = await asset.getCachedValue()
    debug("from cache");
  } else {
    const octokit = new Octokit({ auth: key});
    let response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
      owner: owner,
      repo: repo
    })
  
    issues = response.data
  
    if (issues.comments){
      for (const issue of issues){
        const response = await octokit.request('GET /repos/{owner}/{repo}/issues/{number}/comments', {
          owner: owner,
          repo: repo,
          number: issue.number
        })
  
        issue.comments = response.data
      }
    }
  
    await asset.save(issues, "json");
    debug("from remote");
  }
  return issues
};

const getContent = async (params) => {
  return {
    issues: await getIssues(params)
  };
};

module.exports = (
  eleventyConfig,
  options = {
    key,
    owner,
    repo,    
  }
) => {
  eleventyConfig.addGlobalData(
    "github",
    async () =>
      await getContent({
        key: options.key,
        owner: options.owner,
        repo: options.repo
      })
  );
};
