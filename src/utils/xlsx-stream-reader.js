/*!
 * xlsx-stream-reader
 * Copyright(c) 2016 Brian Taber
 * MIT Licensed
 */
import {XlsxStreamReaderWorkBook} from  './workbook.js'

function XlsxStreamReader (options) {
  if (!(this instanceof XlsxStreamReader)) return new XlsxStreamReader()

  if (!options || typeof options !== 'object') {
    options = {}
  }

  if (typeof options.saxTrim === 'undefined') {
    options.saxTrim = true
  }

  if (typeof options.verbose === 'undefined') {
    options.verbose = true
  }

  if (typeof options.formatting === 'undefined') {
    options.formatting = true
  }

  Object.defineProperty(this, 'options', {
    value: {
      saxStrict: true,
      saxNormalize: true,
      saxPosition: true,
      saxStrictEntities: true,
      saxTrim: options.saxTrim,
      verbose: options.verbose,
      formatting: options.formatting
    },
    writable: true,
    enumerable: true
  })

  return new XlsxStreamReaderWorkBook(this.options)
}

exports.XlsxStreamReader = XlsxStreamReader
