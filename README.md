# action-n8n-semantic-pull-request

GitHub Action to validate that PR titles in [`n8n-io/n8n`](https://github.com/n8n-io/n8n) match [n8n's version](https://www.notion.so/n8n/Release-Process-fce65faea3d5403a85210f7e7a60d0f8) of the Conventional Commits spec.

## Setup

1. Make a `.github/workflows` dir in your repo.
2. Create `.github/workflows/validate-pr-title.yml` containing:

```yml
name: "Validate PR title"

on:
  pull_request:
    types:
      - opened
      - edited
      - synchronize

jobs:
  validate_pr_title:
    name: Validate PR title
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Validate PR title
        uses: ivov/action-n8n-semantic-pull-request@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

> **Warning**: Only the `pull_request` event may be used as a workflow trigger.

3. Store `GITHUB_TOKEN` as a [repo secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository). Required for fetching the latest PR title on update.

## Output

On validation failure, this action will populate the [`validation_issues` output](https://docs.github.com/en/actions/using-jobs/defining-outputs-for-jobs). You can use this output in subsequent steps, e.g. to send the validation issue as a comment on the pull request.

<details>
<summary>Output usage example</summary>

````yml
name: Validate PR title

on:
  pull_request:
    types:
      - opened
      - edited
      - synchronize

jobs:
  main:
    name: Validate PR title
    runs-on: ubuntu-latest
    steps:
      - uses: ivov/action-n8n-semantic-pull-request@v1.0.0
        id: validate_pr_title
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - uses: marocchino/sticky-pull-request-comment@v2
        if: always() # ensure workflow continues executing despite validation errors
        with:
          header: pr_title_failed_validation
          message: |
            Thank you for your contribution!

            PR titles in this repo follow our version of the Conventional Commits spec.
            This allows us to automatically generate the changelog for the next release.
            Therefore, we ask you to adjust your PR title to solve the issue(s) below:

            ```
            ${{ steps.validate_pr_title.outputs.validation_issues }}
            ```

      - if: ${{ steps.validate_pr_title.outputs.validation_issues == null }}
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          header: pr_title_failed_validation
          delete: true # delete prior comment when issue is resolved
````

</details>

## Release

```
git tag -m "Release v1.x.x" v1.x.x
git push --follow-tags
```

## Author

© 2022 [Iván Ovejero](https://github.com/ivov)

## License

Distributed under the [MIT License](LICENSE.md).
