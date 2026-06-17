import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../../src/config/database';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

describe('database config Unit Tests', () => {
  let originalExit: typeof process.exit;

  beforeAll(() => {
    originalExit = process.exit;
    // @ts-ignore
    process.exit = jest.fn();
  });

  afterAll(() => {
    process.exit = originalExit;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully connect to database', async () => {
    (mongoose.connect as jest.Mock).mockResolvedValue(null);
    await connectDatabase();
    expect(mongoose.connect).toHaveBeenCalled();
    expect(process.exit).not.toHaveBeenCalled();
  });

  it('should exit on database connection error', async () => {
    const error = new Error('Connection failed');
    (mongoose.connect as jest.Mock).mockRejectedValue(error);
    await connectDatabase();
    expect(mongoose.connect).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should successfully disconnect database', async () => {
    (mongoose.disconnect as jest.Mock).mockResolvedValue(null);
    await disconnectDatabase();
    expect(mongoose.disconnect).toHaveBeenCalled();
  });

  it('should handle disconnect error gracefully', async () => {
    const error = new Error('Disconnect failed');
    (mongoose.disconnect as jest.Mock).mockRejectedValue(error);
    await disconnectDatabase();
    expect(mongoose.disconnect).toHaveBeenCalled();
  });
});
