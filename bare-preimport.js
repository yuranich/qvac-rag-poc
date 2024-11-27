const { TextEncoder, TextDecoder } = require('text-encoding')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
require('bare-process/global')
const fetch = require('bare-fetch')
global.fetch = fetch
global.Headers = fetch.Headers
global.Response = fetch.Response
const util = require('bare-utils')
util.TextEncoder = TextEncoder
util.TextDecoder = TextDecoder