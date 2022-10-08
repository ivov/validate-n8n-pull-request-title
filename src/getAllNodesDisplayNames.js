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
      `npm i typescript; touch parser.ts; echo "${PARSER_CONTENT}" > parser.ts`
    );
    const result = await exec("npx ts-node parser.ts");

    return JSON.parse(result.stdout);
  } catch (error) {
    console.error("Failed to generate list of node display names");
    console.error(error);
  }
}

module.exports = {
  getAllNodesDisplayNames,
};
