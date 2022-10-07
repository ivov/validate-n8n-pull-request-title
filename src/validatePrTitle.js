const { closest } = require("fastest-levenshtein");
const { toBaseForm } = require("verbutils")();
const { getAllNodesDisplayNames } = require("./getAllNodesDisplayNames");
const { TYPES, SCOPES, NO_CHANGELOG, ERRORS, REGEXES } = require("./constants");

/**
 * Validate that a pull request title conforms to n8n semantic conventions.
 *
 * See: https://www.notion.so/n8n/Release-Process-fce65faea3d5403a85210f7e7a60d0f8
 */
async function validatePrTitle(title) {
  const match = title.match(REGEXES.CONVENTIONAL_SCHEMA);

  // general validation

  if (!match) return [ERRORS.CONVENTIONAL_SCHEMA_MISMATCH];

  if (containsTicketNumber(title)) return [ERRORS.TICKET_NUMBER_PRESENT];

  const issues = [];

  // type validation

  if (!match?.groups?.type) {
    issues.push(ERRORS.TYPE_NOT_FOUND);
  }

  const { type } = match.groups;

  if (isInvalidType(type)) {
    issues.push(ERRORS.INVALID_TYPE);
  }

  // scope validation

  const { scope } = match.groups;

  if (scope && isBaseInvalidScope(scope) && !scope.endsWith(" Node")) {
    issues.push(ERRORS.INVALID_SCOPE);
  } else if (scope && scope.endsWith(" Node")) {
    const names = await getAllNodesDisplayNames();

    if (isInvalidNodeScope(scope, names)) {
      const closest = getClosestMatch(scope, names);
      const supplement = `. Did you mean \`${closest} Node\`?`;
      issues.push(ERRORS.INVALID_SCOPE + supplement);
    }
  }

  // subject validation

  const { subject } = match.groups;

  if (startsWithUpperCase(subject)) {
    issues.push(ERRORS.UPPERCASE_INITIAL_IN_SUBJECT);
  }

  if (endsWithPeriod(subject)) {
    issues.push(ERRORS.FINAL_PERIOD_IN_SUBJECT);
  }

  if (doesNotUsePresentTense(subject)) {
    issues.push(ERRORS.NO_PRESENT_TENSE_IN_SUBJECT);
  }

  if (hasSkipChangelog(subject) && skipChangelogIsNotSuffix(subject)) {
    issues.push(ERRORS.SKIP_CHANGELOG_NOT_SUFFIX);
  }

  return issues;
}

/**
 * Helpers
 */

const isInvalidType = (str) => !TYPES.includes(str);

const isBaseInvalidScope = (str) =>
  !SCOPES.some((scope) => str.includes(scope));

// if (/, /.test(str)) {
//   console.log("here");
//   // console.log(`result ${str}`, str.split(", ").some(isInvalidScope));
//   const scopes = str.split(", ");

//   // return str.split(", ").some(async (s) => await isInvalidScope(s));
//   return await Promise.all(scopes.map(isInvalidScope));
// }

const isInvalidNodeScope = (str, allNodesDisplayNames) =>
  !allNodesDisplayNames.some((name) => str.startsWith(name));

const startsWithUpperCase = (str) => /[A-Z]/.test(str.charAt(0));

const endsWithPeriod = (str) => str.charAt(str.length - 1) === ".";

const containsTicketNumber = (str) => REGEXES.TICKET.test(str);

const doesNotUsePresentTense = (str) => {
  const verb = str.split(" ").shift();

  return verb !== toBaseForm(verb);
};

const hasSkipChangelog = (str) => str.includes(NO_CHANGELOG);

const skipChangelogIsNotSuffix = (str) => {
  const suffixPattern = [" ", escapeForRegex(NO_CHANGELOG), "$"].join("");

  return !new RegExp(suffixPattern).test(str);
};

const escapeForRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getClosestMatch = (str, names) =>
  closest(str.split(" Node").shift(), names);

module.exports = { validatePrTitle };
