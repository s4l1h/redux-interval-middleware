# redux-interval-middleware

Redux Interval Middleware

## Setup

## Install Package

`yarn add redux-interval-middleware`

OR

`npm install redux-interval-middleware`

## apply middleware

```js
import { createStore, applyMiddleware } from 'redux';
import intervalMiddleware from 'redux-interval-middleware';

const store = createStore(todos, ['Use Redux'], applyMiddleware(intervalMiddleware));
// const store = createStore(todos, ['Use Redux'], applyMiddleware(intervalMiddleware,logger));
// OR
// const api = axios ....
// const store = createStore(
//   todos,
//   ['Use Redux'],
//   applyMiddleware(intervalMiddleware.withExtraArgument(api))
// );
```

## How to Use?

The Middleware catches the type of action equal to INTERVAL.

### Start

```js
dispatch({
  type: 'INTERVAL', // type has to equal "INTERVAL".
  payload: {
    name: 'FETCH_FROM_TYPICODE',
    time: 10, // period second
    runNow: true, // run immediately otherwise it will wait until the time to run.
    command: 'start', // start interval
    // this our callback function
    callback: (dispatch, getStore, extraArgument) => {
      fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => response.json())
        .then(json => dispatch({ type: 'FETCH_FROM_TYPICODE_DONE', payload: json }))
        .catch(e => {
          dispatch({ type: FETCH_FROM_TYPICODE_DONE, payload: e.toString() });
        });
    }
  }
});
```

### Stop

```js
dispatch({
  type: 'INTERVAL', // type has to equal "INTERVAL".
  payload: {
    name: 'FETCH_FROM_TYPICODE',
    command: 'stop' // stop it
  }
});
```

### Stop ALL

```js
dispatch({
  type: 'INTERVAL', // type has to equal "INTERVAL".
  payload: {
    command: 'stopAll' // stop all interval jobs
  }
});
```

# Example with react hooks useEffect

```js
useEffect(() => {
  // Set LOADER
  loading(true); // dispatch something about loader

  const ID = 1; // it might be coming from url

  dispatch({
    type: 'INTERVAL', // type has to equal "INTERVAL".
    payload: {
      name: 'FETCH_FROM_TYPICODE',
      time: 10, // period second
      runNow: true, // run immediately other wise it will wait until the time to run.
      command: 'start', // this interval command for start it
      // this our callback function
      callback: (dispatch, getStore, extraArgument) => {
        fetch('https://jsonplaceholder.typicode.com/todos/${ID}')
          .then(response => response.json())
          .then(json => dispatch({ type: 'FETCH_FROM_TYPICODE_DONE', payload: json }))
          .catch(e => {
            dispatch({ type: FETCH_FROM_TYPICODE_DONE, payload: e.toString() });
          });
      }
    }
  });

  return () => {
    dispatch({
      type: 'INTERVAL', // type has to equal "INTERVAL".
      payload: {
        name: 'FETCH_FROM_TYPICODE',
        command: 'stop' // this interval command for start it
      }
    });
  };
  // eslint-disable-next-line
}, [ID]);
```
