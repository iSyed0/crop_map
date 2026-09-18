// Authenticates to Google Earth Engine with a service-account key and keeps
// exactly one initialized session alive for the life of the process. Every
// route handler awaits initEarthEngine() before touching `ee` — cheap after
// the first call since readyPromise is cached.
import ee from '@google/earthengine'
import fs from 'node:fs'

let readyPromise = null

function loadServiceAccountKey() {
  const inlineJson = process.env.GEE_SERVICE_ACCOUNT_KEY_JSON
  if (inlineJson) return JSON.parse(inlineJson)

  const keyPath = process.env.GEE_SERVICE_ACCOUNT_KEY_PATH
  if (!keyPath) {
    throw new Error(
      'No Earth Engine credentials configured. Set GEE_SERVICE_ACCOUNT_KEY_PATH (path to the ' +
        'service-account JSON key) or GEE_SERVICE_ACCOUNT_KEY_JSON (the key contents, inline) in server/.env — ' +
        'see server/.env.example.'
    )
  }
  if (!fs.existsSync(keyPath)) {
    throw new Error(`GEE_SERVICE_ACCOUNT_KEY_PATH is set to "${keyPath}" but that file does not exist.`)
  }
  return JSON.parse(fs.readFileSync(keyPath, 'utf8'))
}

export function initEarthEngine() {
  if (readyPromise) return readyPromise

  readyPromise = new Promise((resolve, reject) => {
    let key
    try {
      key = loadServiceAccountKey()
    } catch (err) {
      readyPromise = null // let a later request retry once credentials are fixed
      reject(err)
      return
    }

    ee.data.authenticateViaPrivateKey(
      key,
      () => {
        ee.initialize(
          null,
          null,
          () => resolve(ee),
          (err) => {
            readyPromise = null
            reject(new Error(`ee.initialize failed: ${err}`))
          }
        )
      },
      (err) => {
        readyPromise = null
        reject(new Error(`Earth Engine authentication failed: ${err}`))
      }
    )
  })

  return readyPromise
}

// Wraps the callback-style `.evaluate()` every ee.ComputedObject exposes into
// a Promise, so route handlers can just `await` results.
export function evaluate(eeObject) {
  return new Promise((resolve, reject) => {
    eeObject.evaluate((result, err) => (err ? reject(new Error(err)) : resolve(result)))
  })
}

export default ee
