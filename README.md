# redux-interval-middleware

Redux Interval Middleware

You can look at the [demo](https://codesandbox.io/s/redux-interval-middleware-example-xfuso) application.

## Setup

## Install Package

`yarn add redux-interval-middleware`

OR

`npm install redux-interval-middleware`

## apply middleware

```js
import { createStore, applyMiddleware } from "redux";
import intervalMiddleware from "redux-interval-middleware";

const store = createStore(todos, ["Use Redux"], applyMiddleware(intervalMiddleware));
// const store = createStore(todos, ['Use Redux'], applyMiddleware(intervalMiddleware,logger));
// OR
// const api = axios ....
// const store = createStore(
//   todos,
//   ['Use Redux'],
//   applyMiddleware(intervalMiddleware.withExtraArgument({api}))
// );
```

## How to Use?

The Middleware catches the type of action equal to INTERVAL.

### Start

It doesn't make sense if you run start command repeatedly with the same **name** because the **start** command registers the job.
If you set **runNow** variable to **true** it will call the callback function immediately as well.

```js
dispatch({
  type: "INTERVAL", // type has to be "INTERVAL".
  payload: {
    name: "FETCH_FROM_TYPICODE",
    time: 10, // period second
    runNow: true, // run immediately otherwise it will wait until the time to run.
    command: "start", // This command starts interval job
    // this our callback function
    callback: (dispatch, getStore, extraArgument) => {
      fetch("https://jsonplaceholder.typicode.com/todos/1")
        .then(response => response.json())
        .then(json => dispatch({ type: "FETCH_FROM_TYPICODE_DONE", payload: json }))
        .catch(e => {
          dispatch({ type: FETCH_FROM_TYPICODE_ERROR, payload: e.toString() });
        });
    }
  }
});
```

### Stop

```js
dispatch({
  type: "INTERVAL", // type has to be "INTERVAL".
  payload: {
    name: "FETCH_FROM_TYPICODE",
    command: "stop" // This command stops interval job
  }
});
```

### Stop ALL

```js
dispatch({
  type: "INTERVAL", // type has to be "INTERVAL".
  payload: {
    command: "stopAll" // This command stops all interval jobs
  }
});
```

### call - This command will call your callback function manually.

```js
dispatch({
  type: "INTERVAL", // type has to be "INTERVAL".
  payload: {
    name: "FETCH_FROM_TYPICODE",
    command: "call" // This command calls the callback function manually
  }
});
```

# Example with react hooks useEffect

```js
useEffect(() => {
  const ID = 1; // it might be coming from url

  dispatch({
    type: "INTERVAL", // The type has to be "INTERVAL".
    payload: {
      name: "FETCH_FROM_TYPICODE",
      time: 10, // period second : Callback function will call every 10 seconds.
      runNow: true, // run immediately otherwise it will wait until the time to run.
      command: "start", // this interval command for start it
      // this our callback function
      callback: (dispatch, getStore, extraArgument) => {
        fetch("https://jsonplaceholder.typicode.com/todos/${ID}")
          .then(response => response.json())
          .then(json => dispatch({ type: "FETCH_FROM_TYPICODE_DONE", payload: json }))
          .catch(e => {
            dispatch({ type: FETCH_FROM_TYPICODE_ERROR, payload: e.toString() });
          });
      }
    }
  });

  return () => {
    dispatch({
      type: "INTERVAL", // The type has to be "INTERVAL".
      payload: {
        name: "FETCH_FROM_TYPICODE",
        command: "stop" // This command stops the interval.
      }
    });
  };
  // eslint-disable-next-line
}, [ID]);
```
