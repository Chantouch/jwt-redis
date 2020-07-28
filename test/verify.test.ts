import redis from 'redis-mock';
import JwtRedis from '../src';
import {TokenExpiredError} from "../src";
import {generateId} from "../src/utils";

describe('Verify Token', () => {
    let jwt: JwtRedis;
    let redisClient: redis.RedisClient;

    beforeEach(() => {
        jest.resetModules();
        jest.doMock('redis-mock', () => redis)
        redisClient = redis.createClient();
        jwt = new JwtRedis(redisClient);
    });

    it('should be able to verify token after login.', async (done) => {
        const key = generateId(10);
        const payload = {jti: generateId(10)};
        try {
            const token: string = await jwt.sign(payload, key);
            const decoded = await jwt.verify(token, key);
            expect(decoded).toHaveProperty('iat');
            done();
        } catch (e) {
            done(e);
        }
    });

    it('2', async (done) => {
        const key = generateId(10);
        const payload = {jti: generateId(10)};
        try {
            const token: string = await jwt.sign(payload, key, {expiresIn: '1d'});
            const decoded = await jwt.verify<{ jti: string }>(token, key);
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
        const payload = {jti: generateId(10)};
        try {
            const token: string = await jwt.sign(payload, key, {expiresIn: '0s'});
            expect(jwt.verify<{ jti: string }>(token, key)).rejects.toBeInstanceOf(TokenExpiredError);
            done();
        } catch (e) {
            done(e);
        }
    });

    it('4', async (done) => {
        const key = generateId(10);
        const payload = {jti: generateId(10), exp: new Date().getSeconds()};
        try {
            const token: string = await jwt.sign(payload, key);
            expect(jwt.verify<{ jti: string }>(token, key)).rejects.toBeInstanceOf(TokenExpiredError);
            done();
        } catch (e) {
            done(e);
        }
    });
});
