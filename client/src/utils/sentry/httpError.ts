export class HttpError extends Error {
  readonly statusCode: number;
  readonly endpoint: string;

  constructor(message: string, statusCode: number, endpoint: string = '') {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
}
