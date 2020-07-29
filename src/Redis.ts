import {RedisClient} from "redis";


export default class Redis {
    private readonly client: RedisClient;

    constructor(client: RedisClient) {
        this.client = client;
    }

    /**
     * Set method
     * @param {string} key
     * @param {string} value
     */
    public set(key: string, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
            return this.client.set(key, value, (err: Error) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * Set Expiration method
     * @param {string} key
     * @param {string} value
     * @param {string} mode
     * @param {number} duration
     */
    public setExpire(key: string, value: string, mode: string, duration: number): Promise<void> {
        return new Promise((resolve, reject) => {
            return this.client.set(key, value, mode, duration, (err: Error) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * Delete method
     * @param {string} key
     */
    public del(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            return this.client.del(key, (err: Error) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }

    /**
     * Get method
     * @param {string} key
     */
    public get(key: string): Promise<string | undefined> {
        return new Promise((resolve, reject) => {
            return this.client.get(key, (err: Error | null, reply: any) => {
                if (err) {
                    reject(err);
                }
                resolve(reply);
            })
        });
    }
}
