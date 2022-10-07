const { exec: callbackExec } = require("child_process");
const { promisify } = require("util");
const exec = promisify(callbackExec);

const core = require("@actions/core");
const github = require("@actions/github");

const { validatePrTitle } = require("./src/validatePrTitle");
const { PARSER_CONTENT } = require("./src/constants");

async function run() {
  try {
    const contextPullRequest = github.context.payload.pull_request;

    if (!contextPullRequest) {
      throw new Error(
        "This action may only be used in response to `pull_request` events. Set `pull_request` in the `on` section in your workflow."
      );
    }

    const owner = contextPullRequest.base.user.login;
    const repo = contextPullRequest.base.repo.name;

    const client = github.getOctokit(process.env.GITHUB_TOKEN, {
      baseUrl: "https://api.github.com",
    });

    // When user updates a PR title, context PR data is outdated,
    // so fetch the latest PR data via GitHub REST API.
    const { data: pullRequest } = await client.rest.pulls.get({
      owner,
      repo,
      pull_number: contextPullRequest.number,
    });

    // if (/\(.* Node\)/.test(pullRequest.title)) {
    //   try {
    //     // console.log("cwd", process.cwd());
    //     // await exec("npm i typescript fast-glob");
    //     // await exec(`touch parser.ts; echo "${PARSER_CONTENT}" > parser.ts`);
    //     // const execResult = await exec("npx ts-node parser.ts");
    //     // console.log(execResult);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    const issues = await validatePrTitle(pullRequest.title);

    if (issues.length > 0) {
      console.error("PR title failed validation");
      core.setOutput("validation_issues", issues);

      throw new Error(issues);
    }

    console.info("PR title validated successfully");
  } catch (error) {
    console.error("validate-n8n-pull-request-title failed to run");
    core.setFailed(error.message);
  }
}

run();
