const path = require("path");

/**
 * @returns ["Action Network", "Active Campaign", etc.]
 */
function getAllNodesDisplayNames() {
  return getAllNodesDistPaths().map((distPath) => {
    const nodeFilePath = path.resolve("packages", "nodes-base", distPath);
    const NodeClass = getNodeClass(nodeFilePath);
    const node = new NodeClass();

    return node.description.displayName;
  });
}

/**
 * @returns ["dist/nodes/ActionNetwork/ActionNetwork.node.js", etc.]
 */
function getAllNodesDistPaths() {
  const nodesBasePackageJsonPath = path.resolve(
    "packages",
    "nodes-base",
    "package.json"
  );

  return require(nodesBasePackageJsonPath).n8n.nodes;
}

function getNodeClass(nodeFilePath) {
  const className = nodeFilePath.split("/").pop().replace(".node.js", "");

  return require(nodeFilePath)[className];
}

module.exports = {
  getAllNodesDisplayNames,
};
