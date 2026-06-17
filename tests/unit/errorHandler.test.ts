import { Request, Response, NextFunction } from 'express';
import { errorHandler, AppError } from '../../src/middlewares/errorHandler';

describe('errorHandler Middleware Unit Tests', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should handle AppError with custom status code and message', () => {
    const error = new AppError('Custom Error', 400);
    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Custom Error',
    }));
  });

  it('should fallback to 500 status code for generic error', () => {
    const error = new Error('Generic Error');
    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Generic Error',
    }));
  });
});
