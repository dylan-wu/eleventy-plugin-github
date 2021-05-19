const pluginGithub = require("../");

require("dotenv").config();
const { GITHUB_KEY, GITHUB_OWNER, GITHUB_REPO } = process.env;

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(pluginGithub, {
    key: GITHUB_KEY,
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO    
  });
};
