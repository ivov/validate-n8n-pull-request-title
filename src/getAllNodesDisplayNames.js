const { exec: callbackExec } = require("child_process");
const { promisify } = require("util");
const exec = promisify(callbackExec);
const { PARSER_CONTENT } = require("./constants");

/**
 * @returns { Promise<string[]> } e.g. ["Action Network", "Active Campaign", etc.]
 */
async function getAllNodesDisplayNames() {
  await exec("npm i typescript fast-glob");
  await exec(`touch parser.ts; echo "${PARSER_CONTENT}" > parser.ts`);
  const result = await exec("npx ts-node parser.ts");
  console.log("result", result.stdout);

  return JSON.parse(result.stdout);
}

module.exports = {
  getAllNodesDisplayNames,
};

// const path = require("path");

// /**
//  * @returns ["Action Network", "Active Campaign", etc.]
//  */
// function getAllNodesDisplayNames() {
//   return getAllNodesDistPaths().map((distPath) => {
//     const nodeFilePath = path.resolve("packages", "nodes-base", distPath);
//     const NodeClass = getNodeClass(nodeFilePath);
//     const node = new NodeClass();

//     return node.description.displayName;
//   });
// }

// /**
//  * @returns ["dist/nodes/ActionNetwork/ActionNetwork.node.js", etc.]
//  */
// function getAllNodesDistPaths() {
//   const nodesBasePackageJsonPath = path.resolve(
//     "packages",
//     "nodes-base",
//     "package.json"
//   );

//   return require(nodesBasePackageJsonPath).n8n.nodes;
// }

// function getNodeClass(nodeFilePath) {
//   const className = nodeFilePath.split("/").pop().replace(".node.js", "");

//   return require(nodeFilePath)[className];
// }
