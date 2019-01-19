# Operations

Operations are shared operations or required interfaces with the API. These files require a component that uses it to be a container component since it needs `store.dispatch()` to be passed in.

These essentially replace the overarching `actions.jsx` file from the previous ground-server, although now it is split and easier to read overall.

A general layout is:

```
export const MyOperations = (
  myFunction: dispatch => (
    arg1 => {
      ...function
    }
  )
)
```

So then it may be called in container components as `MyOperations.myFunction(dispatch)(arg1)`, after importing `MyOperations`.

If you need to call an API, please see the respective API files in [/util](../util)