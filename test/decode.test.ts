import redis from 'redis-mock';
import JwtRedis from '../src';
import {generateId} from "../src/utils";

describe('Decode Token', () => {
    let jwt: JwtRedis;
    let redisClient: redis.RedisClient;

    beforeEach(() => {
        jest.resetModules();
        jest.doMock('redis-mock', () => redis)
        redisClient = redis.createClient();
        jwt = new JwtRedis(redisClient);
    });

    it('1', async (done) => {
        const key = generateId(10);
        const payload = {jti: generateId(10)};
        try {
            const token: string = await jwt.sign(payload, key);
            const decoded = jwt.decode<{ jti: string }>(token);
            expect(decoded).toHaveProperty('iat');
            expect(payload.jti).toEqual(decoded.jti);
            done()
        } catch (e) {
            done(e);
        }
    });

    it('2', async (done) => {
        const key = generateId(10);
        const payload = {jti: generateId(10)};
        try {
            const token: string = await jwt.sign(payload, key, {expiresIn: '1d'});
            const decoded = jwt.decode<{jti: string}>(token);
            expect(decoded).toHaveProperty('iat');
            expect(decoded).toHaveProperty('exp');
            expect(payload.jti).toEqual(decoded.jti);
            done();
        } catch (e) {
            done(e);
        }
    });

    it('3', async (done) => {
        const key = generateId(10);
        const payload = {jti: generateId(10), exp: new Date().getSeconds()};
        try {
            const token: string = await jwt.sign(payload, key);
            const decoded = jwt.decode<{jti: string}>(token);
            expect(decoded).toHaveProperty('iat');
            expect(decoded).toHaveProperty('exp');
            expect(payload.jti).toEqual(decoded.jti);
            done();
        } catch (e) {
            done(e);
        }
    });
});
