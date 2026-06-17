import * as models from '../../src/models/index';
import * as repositories from '../../src/repositories/index';
import * as services from '../../src/services/index';
import * as controllers from '../../src/controllers/index';

describe('Index Exports Unit Tests', () => {
  it('should export all items correctly', () => {
    expect(models).toBeDefined();
    expect(repositories).toBeDefined();
    expect(services).toBeDefined();
    expect(controllers).toBeDefined();
  });
});
