<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [ground-server-site](#ground-server-site)
  - [Installation](#installation)
  - [Development guide](#development-guide)
  - [Running](#running)
  - [Testing](#testing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# ground-server-site

Welcome to the fully upgraded, WIP `ground-server` frontend. We are now using the latest version of ReactJS and Redux instead of NuclearJS.

## Installation

1. Clone the repo
2. Run `npm i` to install all the node modules. `gulp` to build the files is coming soon :( More to come!
3. `pip install pre-commit` and then run `pre-commit install` to run `pre-commit` hooks to ensure your commits are nice and cool 8)
4. Run `npm run start` and navigate to `localhost:3000` to see if it works!

## Development guide

This repo was created with `create-react-app`. When creating a new branch, please use the format of `<your-username>/<informative-branch-name>`. Do not commit to master (you shouldn't be able to anyway) and only squash PRs (you also shouldn't be able to do anything else either).

Before submitting your branch for a PR, Travis CI will enforce linting practices as defined in the `.eslintrc` file. If you properly installed `pre-commit` in the installation steps, this should be automatically done. If linting still fails for some reason, run:

`./scripts/bin/lint`

to manually run the linting script.

## Running
Run `npm run start` will run the dev server and will automatically watch changes. Keep in mind this will not run `ground-server`, so you will need to run it separately.

Check `src/constants/links.js` to ensure that `GROUND_SERVER_URL` is properly set between prod and local. It will default to `127.0.0.1:9000` if your `NODE_ENV` environment variable is set to `development`, and `192.168.0.22` otherwise.

## Testing
We use Jest as our testing framework. See some test files for examples for now. You can run `npm run test` to run all existing tests with various modes. Please ensure all tests are passing before asking for a review on a PR.
