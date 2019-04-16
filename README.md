# ground-server-site

Welcome to the fully upgraded, WIP `ground-server` frontend. We are now using the latest version of ReactJS and Redux instead of NuclearJS.

## Installation

Clone the repo and run `npm i` to install all the node modules. `gulp` to build the files is coming soon :( More to come!

## Development guide

This repo was created with `create-react-app`. When creating a new branch, please use the format of `<your-username>/<informative-branch-name>`. Do not commit to master (you shouldn't be able to anyway) and only squash PRs (you also shouldn't be able to do anything else either).

Before submitting your branch for a PR, Travis CI will enforce linting practices as defined in the `.eslintrc` file. In order to ensure that linting will pass, please run:

`scripts/bin/lint`

and push the modified files (as it will analyze/fix linting errors, warnings are ok for now) to ensure that Travis will not error.

## Running
For now, run `npm run start` will run the dev server and will automatically watch changes. Keep in mind this will not run `ground-server`, so you will need to run it separately. 

Check `src/constants/links.js` to ensure that `GROUND_SERVER_URL` is properly set between prod and local. 

## Testing
We use Jest as our testing framework. See some test files for examples for now. You can run `npm run test` to run all existing tests with various modes. Please ensure all tests are passing before asking for a review on a PR.
