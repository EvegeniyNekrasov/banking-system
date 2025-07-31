/**
 * @enum {number}
 * @readonly
 * @description HTTP Status codes
 */
const HttpStatus = Object.freeze({
  /** 200 OK - the request has succeeded */
  OK: 200,
  /** 201 Created - the request been fulfilled and new resource has been created */
  CREATED: 201,
  /** 204 No Content – the server successfully processed the request and is not returning any content. */
  NO_CONTENT: 204,
  /** 301 Moved Permanently – the requested resource has a new permanent URI. */
  MOVED_PERMANENTLY: 301,
  /** 304 Not Modified – indicates that the resource has not been modified since the version specified by the request headers. */
  NOT_MODIFIED: 304,
  /** 400 Bad Request – the server could not understand the request due to invalid syntax. */
  BAD_REQUEST: 400,
  /** 401 Unauthorized – the request requires user authentication. */
  UNAUTORIZED: 401,
  /** 403 Forbidden – the server understood the request, but refuses to authorize it. */
  FORBIDDEN: 403,
  /** 404 Not Found – the server has not found anything matching the request URI. */
  NOT_FOUND: 404,
  /** 500 Internal Server Error - an unexpected condition was found */
  INTERNAL_SERVER_ERROR: 500,
});

export default HttpStatus;
