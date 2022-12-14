const { exec: callbackExec } = require("child_process");
const { promisify } = require("util");
const exec = promisify(callbackExec);
const { PARSER_CONTENT } = require("./parserContent");

/**
 * @returns { Promise<string[]> } e.g. ["Action Network", "Active Campaign", etc.]
 */
async function getAllNodesDisplayNames() {
  try {
    await exec(
      `npm i typescript fast-glob; npm i -g ts-node; touch parser.ts; echo "${PARSER_CONTENT}" > parser.ts`,
    );
    const result = await exec("ts-node parser.ts");

    console.log(result);

    return JSON.parse(result.stdout);
  } catch (error) {
    console.error("Failed to generate list of node display names");
    console.error(error);
  }
}

module.exports = {
  getAllNodesDisplayNames,
};
