import redis from 'redis-mock';
import JwtRedis, {TokenDestroyedError} from '../src';
import {generateId} from "../src/utils";

describe('Logout', () => {
    let jwt: JwtRedis;
    let redisClient: redis.RedisClient;

    beforeEach(() => {
        jest.resetModules();
        jest.doMock('redis-mock', () => redis);
        redisClient = redis.createClient();
        jwt = new JwtRedis(redisClient);
    });

    it('should throw the error instance, after token was destroyed.', async (done) => {
        const key = generateId(10);
        const payload = {jti: generateId(10)};
        try {
            const token: string = await jwt.sign(payload, key);
            expect(typeof token).toBe('string');
            await jwt.destroy(payload.jti);
            expect(jwt.verify(token, key)).rejects.toBeInstanceOf(TokenDestroyedError);
            done();
        } catch (e) {
            done(e);
        }
    });
});
