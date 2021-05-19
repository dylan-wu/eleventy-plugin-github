const { Octokit, App, Action } = require("octokit");
require("dotenv").config();
const { GITHUB_KEY, GITHUB_OWNER, GITHUB_REPO } = process.env;

const getIssues = async () =>{
    const octokit = new Octokit({ auth: GITHUB_KEY });
    
    let response = await octokit.request('GET /repos/{owner}/{repo}/issues', {
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO
    })

    let issues = response.data
    for (const issue of issues){
        const response = await octokit.request('GET /repos/{owner}/{repo}/issues/{number}/comments', {
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            number: issue.number
          })

        issue.comments = response.data
    }
    return issues
};

getIssues().then((data)=>{
    data.forEach((issue) =>{
        let labelNames = issue.labels.map( (label) => label.name)
        console.log(`${issue.number}: ${issue.title} [${labelNames}]`)
        console.log(`\t${issue.body} `)
        console.log(`\t>${issue.comments}`)
    })
})