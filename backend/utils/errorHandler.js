//orey oru error class create panni pala vidhamala errors anupa poram.

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    // The super keyword is used to call the constructor of its parent class to access the parent's properties and methods.
    super(message);
    this.statusCode = statusCode;
    //parent Error class la stack nu oru property irukku
    Error.captureStackTrace(this, this.constructor);
    //captureStackTrace fun nammaku oru stack property kudukum adhu nammaku enga error kudukudhu, error information show pannum
    //captureStacktrace namma oru object pass pannanum
    //this --> point out the ErrorHandler
    //this.constructor() -->  point out ErrorHandler consturctor
  }
}

module.exports = ErrorHandler;
