import * as redis from 'redis';
import * as jsonwebtoken from 'jsonwebtoken';
import {
    Secret,
    SignOptions,
    VerifyErrors,
    DecodeOptions,
    VerifyOptions,
    GetPublicKeyOrSecret
} from "jsonwebtoken";
import Redis from "./Redis";
import TokenInvalidError from "./error/TokenInvalidError";
import TokenDestroyedError from "./error/TokenDestroyedError";
import { generateId } from "./utils";

export interface Options {
    prefix: string;
}

export default class JwtRedis {
    private readonly options: Options;
    private readonly redis: Redis;

    constructor(private readonly client: redis.RedisClient, options?: Options) {
        this.options = Object.assign({prefix: 'jwt_label:'}, options || {});
        this.redis = new Redis(client);
    }

    /**
     * Sign method
     * @param payload
     * @param secretOrPrivateKey
     * @param options
     */
    public sign<T extends object & { jti?: string }>(payload: T, secretOrPrivateKey: Secret, options?: SignOptions): Promise<string> {
        return Promise.resolve()
            .then(async () => {
                const jti = payload.jti || generateId(10);
                const token: string = jsonwebtoken.sign({...payload, jti}, secretOrPrivateKey, options);
                const decoded: any = jsonwebtoken.decode(token);
                const key = this.options.prefix + jti;
                if (decoded.exp) {
                    await this.redis.setExpire(key, 'true', 'EX', Math.floor(decoded.exp - Date.now() / 1000));
                } else {
                    await this.redis.set(key, 'true');
                }
                return token;
            })
    }

    /**
     * Destroy method
     * @param {string} jti
     */
    public destroy(jti: string): Promise<void> {
        const key = this.options.prefix + jti;
        return this.redis.del(key);
    }

    /**
     * Decode method
     * @param {string} token
     * @param {Object} options
     */
    public decode<T>(token: string, options?: DecodeOptions): T {
        return jsonwebtoken.decode(token, options) as T;
    }

    /**
     * Verify method
     * @param token
     * @param secretOrPublicKey
     * @param options
     */
    public verify<T extends object & { jti?: string }>(token: string, secretOrPublicKey: string | Buffer | GetPublicKeyOrSecret, options?: VerifyOptions): Promise<T> {
        return new Promise((resolve, reject) => {
            return jsonwebtoken.verify(token, secretOrPublicKey, options, (err: VerifyErrors, decoded: T) => {
                if (err) {
                    reject(err);
                }
                resolve(decoded);
            })
        }).then((decoded: T) => {
            if (!decoded.jti) {
                throw new TokenInvalidError();
            }
            const { jti } = decoded;
            const key = this.options.prefix + jti;
            return this.redis.get(key)
                .then((result: string) => {
                    if (!result) {
                        throw new TokenDestroyedError();
                    }
                    return decoded;
                });
        })
    }
}
