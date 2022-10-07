const { exec: callbackExec } = require("child_process");
const { promisify } = require("util");
const exec = promisify(callbackExec);
const { PARSER_CONTENT } = require("./constants");

/**
 * @returns { Promise<string[]> } e.g. ["Action Network", "Active Campaign", etc.]
 */
async function getAllNodesDisplayNames() {
  await exec(
    `npm i typescript; touch parser.ts; echo "${PARSER_CONTENT}" > parser.ts`
  );
  const result = await exec("npx ts-node parser.ts");

  return JSON.parse(result.stdout);
}

module.exports = {
  getAllNodesDisplayNames,
};
