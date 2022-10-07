const { validatePrTitle: validate } = require("./validatePrTitle");
const { ERRORS, NO_CHANGELOG } = require("./constants");
const displayNamesModule = require("./getAllNodesDisplayNames");
const {
  ALL_NODES_DISPLAY_NAMES_FOR_TESTING_ONLY,
  TYPES,
} = require("./constants");

jest.mock("./getAllNodesDisplayNames");

jest
  .spyOn(displayNamesModule, "getAllNodesDisplayNames")
  .mockReturnValue(ALL_NODES_DISPLAY_NAMES_FOR_TESTING_ONLY);

describe("schema", () => {
  test("Validation should fail for conventional schema mismatch", () => {
    ["feat(core):", "feat(core)", "feat(core):implement feature"].forEach(
      (title) => {
        expect(validate(title))
          .toHaveLength(1)
          .toContain(ERRORS.CONVENTIONAL_SCHEMA_MISMATCH);
      }
    );
  });

  test("Validation should fail for valid ticket number in schema", () => {
    [
      "feat(Mattermost node): add new resource n8n-1234",
      "n8n-1234 feat(Mattermost node): add new resource",
      "feat(Mattermost node) n8n-1234: add new resource",
    ].forEach((title) => {
      expect(validate(title))
        .toHaveLength(1)
        .toContain(ERRORS.TICKET_NUMBER_PRESENT);
    });
  });
});

describe("type", () => {
  test("Validation should pass for valid type", () => {
    TYPES.forEach((type) => {
      expect(validate(`${type}(core): implement feature`)).toHaveLength(0);
    });
  });

  test("Validation should fail for invalid type", () => {
    expect(validate("wrong(core): implement feature"))
      .toHaveLength(1)
      .toContain(ERRORS.INVALID_TYPE);
  });
});

describe("scope", () => {
  test("Validation should pass for valid title with scope", () => {
    expect(validate("feat(core): implement feature")).toHaveLength(0);
  });

  test("Validation should pass for title with multiple valid scopes", () => {
    expect(validate("feat(core, editor): implement feature")).toHaveLength(0);
  });

  test("Validation should fail for title with valid scope and invalid scope", () => {
    expect(validate("feat(core, wrong): implement feature"))
      .toHaveLength(1)
      .toContain(ERRORS.INVALID_SCOPE);
  });

  test("Validation should fail for title with multiple invalid scopes", () => {
    expect(validate("feat(wrong1, wrong2): implement feature"))
      .toHaveLength(1)
      .toContain(ERRORS.INVALID_SCOPE);
  });

  test("Validation should pass for valid title without scope", () => {
    expect(validate("feat: implement feature")).toHaveLength(0);
  });

  test("Validation should fail for miscased node suffix", () => {
    expect(validate("feat(Mattermost node): add new resource"))
      .toHaveLength(1)
      .toContain(ERRORS.INVALID_SCOPE);
  });

  test("Validation should fail for misspelled node scope", () => {
    expect(validate("feat(mattermost Node): change default value"))
      .toHaveLength(1)
      .toContain(ERRORS.INVALID_SCOPE + ". Did you mean `Mattermost Node`?");

    expect(validate("feat(Gmai Trigger Node): change default value"))
      .toHaveLength(1)
      .toContain(ERRORS.INVALID_SCOPE + ". Did you mean `Gmail Trigger Node`?");
  });
});

describe("subject", () => {
  test("Validation should fail for uppercase initial in subject", () => {
    expect(validate("feat(core): Implement feature"))
      .toHaveLength(1)
      .toContain(ERRORS.UPPERCASE_INITIAL_IN_SUBJECT);
  });

  test("Validation should fail for final period in subject", () => {
    expect(validate("feat(core): implement feature."))
      .toHaveLength(1)
      .toContain(ERRORS.FINAL_PERIOD_IN_SUBJECT);
  });

  test("Validation should fail for non-present-tense verb", () => {
    [
      "feat(Mattermost Node): added new resource",
      "feat(Mattermost Node): created new resource",
      "fix(Mattermost Node): caught error",
    ].forEach((title) => {
      expect(validate(title))
        .toHaveLength(1)
        .toContain(ERRORS.NO_PRESENT_TENSE_IN_SUBJECT);
    });
  });

  test("Validation should pass for breaking-change indicator", () => {
    expect(validate("feat(Oura Node)!: change default value")).toHaveLength(0);
  });

  test(`Validation should pass for suffixed ${NO_CHANGELOG} indicator`, () => {
    expect(validate("docs(Oura Node): fix typo (no-changelog)")).toHaveLength(
      0
    );
  });

  test(`Validation should fail for non-suffixed ${NO_CHANGELOG} indicator`, () => {
    [
      "docs(Oura Node): fix (no-changelog) typo",
      "docs(Oura Node): fix typo(no-changelog) ",
      "docs(Oura Node): (no-changelog) fix typo",
    ].forEach((title) => {
      expect(validate(title))
        .toHaveLength(1)
        .toContain(ERRORS.SKIP_CHANGELOG_NOT_SUFFIX);
    });
  });
});
