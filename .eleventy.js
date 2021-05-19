const { Octokit, App, Action } = require("octokit");

const getIssues = async ({ key, owner, repo }) => {
    const octokit = new Octokit({ auth: key});
    
    let response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner: owner,
        repo: repo
    })

    let issues = response.data
    for (const issue of issues){
        const response = await octokit.request('GET /repos/{owner}/{repo}/issues/{number}/comments', {
            owner: owner,
            repo: repo,
            number: issue.number
          })

        issue.comments = response.data
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
