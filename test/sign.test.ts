import JwtRedis from '../src';
import {generateId} from "../src/utils";
import redis from 'redis-mock'

describe('Sign In', () => {
    let jwt: JwtRedis;
    let client: redis.RedisClient;

    beforeEach(() => {
        jest.resetModules();
        jest.doMock('redis-mock', () => redis)
        client = redis.createClient();
        jwt = new JwtRedis(client);
    });

    it('should return token after login',  async (done) => {
        const key = generateId(10);
        try {
            const token = await jwt.sign({}, key);
            expect(typeof token).toBe('string');
            done();
        } catch (e) {
            done(e);
        }
    });
});
