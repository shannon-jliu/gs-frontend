# Action Creators

This folder contains all the action creators for each of our stores. Documentation for these are more detailed at [ReduxJS](https://redux.js.org/basics/actions) docs, as that is the package that we use.

## Practices

Always assume that the parameters passed into an action creator are of `Immutable` types, if applicable.

For an example layout, see the [targetSightingActionCreator](src/actions/targetSightingActionCreator.js)

For an example test file, see the corresponding [targetSightingActionCreator test](src/test/actions/targetSightingActionCreator.test.js). Tests are very simple in that it tests to see if the returned action is correct.