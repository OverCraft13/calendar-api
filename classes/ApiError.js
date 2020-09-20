class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  //The request is malformed, such as message body format error.
  static badRequest(msg) {
    return new ApiError(400, msg);
  }
  //Wrong or no authentication ID/password provided.
  static unauthorized(msg) {
    return new ApiError(401, msg);
  }
  //It's used when the authentication succeeded but authenticated user
  // doesn't have permission to the request resource.
  static forbidden(msg) {
    return new ApiError(403, msg);
  }
  //When a non-existent resource is requested.
  static notFound(msg) {
    return new ApiError(404, msg);
  }
  //The error for an unexpected HTTP method.
  static methodNotAcceptable(msg) {
    return new ApiError(405, msg);
  }
  //The client presented a content type in
  //the Accept header which is not supported by the server API.
  static Unacceptable(msg) {
    return new ApiError(406, msg);
  }
  //Use it to signal that the request size exceeded the given limit
  static payloadTooLarge(msg) {
    return new ApiError(413, msg);
  }
  //The requested content type is not supported by the REST service
  static unsupportedMediaType(msg) {
    return new ApiError(415, msg);
  }
  //
  static tooManyRequests(msg) {
    return new ApiError(429, msg);
  }
  //An unexpected condition prevented the server from fulfilling the request.
  static internal(msg) {
    return new ApiError(500, msg);
  }
}

module.exports = ApiError;
