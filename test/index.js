/**
 * Imports
 */

import subscribeMiddleware, {subscribe, unsubscribe} from '../src'
import {applyMiddleware, createStore} from 'redux'
import setProp from '@f/set-prop'
import test from 'tape'

/**
 * Tests
 */

test('should work', t => {
  const {dispatch} = create()

  t.plan(1)
  dispatch(subscribe('url', 'key', () => { t.pass(); return {type: 'dummy'} }))
  dispatch(changePath('url', 'http://www.google.com'))
  dispatch(unsubscribe('url', 'key'))
  dispatch(changePath('url', 'http://www.yahoo.com'))
  t.end()
})

/**
 * Helpers
 */

function reducer (state, action) {
  if (action.type === 'CHANGE_PATH') {
    const {path, value} = action.payload
    return setProp(path, value, state)
  }

  return state
}

function changePath (path, value) {
  return {
    type: 'CHANGE_PATH',
    payload: {path, value}
  }
}

function create () {
  return applyMiddleware(subscribeMiddleware)(createStore)(reducer, {})
}
