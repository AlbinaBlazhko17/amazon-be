import * as request from 'supertest';

import { httpServer } from './setup';

describe('AppController (e2e)', () => {
	it('/ (GET)', () => {
		return request(httpServer).get('/').expect(200).expect({ data: 'Hello World!' });
	});
});
