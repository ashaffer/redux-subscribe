/**
 * Imports
 */

import forEach from '@f/foreach'
import getProp from '@f/get-prop'

/**
 * Action types
 */

const SUBSCRIBE = '@@SUBSCRIBE/subscribe'
const UNSUBSCRIBE = '@@UNSUBSCRIBE/unsubscribe'

/**
 * redux-subscribe
 */

function subscribeMiddleware ({dispatch, getState}) {
  const paths = []
  const subscriptions = {}

  return next => action => {
    switch (action.type) {
      case SUBSCRIBE: {
        const {path, key, fn} = action.payload
        subscriptions[path] = subscriptions[path] || {}
        subscriptions[path][key] = fn
        if (paths.indexOf(path) === -1) {
          paths.push(path)
        }
        break
      }
      case UNSUBSCRIBE: {
        const {path, key} = action.payload
        const subs = subscriptions[path]

        if (subs) {
          delete subs[key]
          if (Object.keys(subs).length === 0) {
            delete subscriptions[path]
            paths.splice(paths.indexOf(path), 1)
          }
        }

        break
      }
      default: {
        const prevState = getState()
        const result = next(action)
        const nextState = getState()

        forEach(path => {
          const prev = getProp(path, prevState)
          const next = getProp(path, nextState)

          if (prev !== next) {
            forEach(fn => dispatch(fn({path, prev, next})), subscriptions[path])
          }
        }, paths)

        return result
      }
    }
  }
}

/**
 * Action creators
 */

function subscribe (path, key, fn) {
  return {
    type: SUBSCRIBE,
    payload: {path, key, fn}
  }
}

function unsubscribe (path, key) {
  return {
    type: UNSUBSCRIBE,
    payload: {path, key}
  }
}

/**
 * Exports
 */

export default subscribeMiddleware
export {
  subscribe,
  unsubscribe
}
