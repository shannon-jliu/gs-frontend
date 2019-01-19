# Action Creators

This folder contains all the action creators for each of our stores. Documentation for these are more detailed at [ReduxJS](https://redux.js.org/basics/actions) docs, as that is the package that we use.

## Practices

Always assume that the parameters passed into an action creator are of `Immutable` types, if applicable.

For an example layout, see the [targetSightingActionCreator](targetSightingActionCreator.js) file.

For an example test file, see the corresponding [targetSightingActionCreator test](../test/actions/targetSightingActionCreator.test.js). Tests are very simple in that it tests to see if the returned action is correct.

## Purpose

These are passed into `store.dispatch()` whenever an action wants to be done on a store. These actions are then referenced within a reducer file to determine what sort of action should be done within the reducer.

For example, given the previous `targetSightingActionCreator` file, see the corresponding [targetSightingReducer](../reducers/targetSightingReducer.js), and note how each `case` statement corresponds to an action defined in `targetSightingActionCreator`.