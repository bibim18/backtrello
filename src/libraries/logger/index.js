import debug from 'debug'
import graylog from './graylog'

export function getLogger (namespace) {
  let logger = debug(namespace)
  return function () {
    logger(...arguments)
    // graylog.info(...arguments, {namespace: namespace})
  }
}

export function init () {
  // Intrgate slack into debug logger
  debug.log = (function (oldLogger) {
    return function () {
      oldLogger(...arguments)
      graylog.info(...arguments)
    }
  })(debug.log)

  // Intragate slack into stdout write
  process.stdout.write = (function (write) {
    return function (string, encoding, fd) {
      write.apply(process.stdout, arguments)
    }
  })(process.stdout.write)
}
