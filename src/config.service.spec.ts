import { existsSync, mkdirSync, unlink, writeFileSync } from 'fs';
import { ConfigService } from './config.service';
jest.mock('os');
const polyCliDir = '.poly-cli';
const configJson = 'config.json';
const configPath = polyCliDir + '/' + configJson;

describe('ConfigService', () => {
    let configService: ConfigService;

    beforeAll(() => {
        const config = {
            apiKey: 'a',
            apiSecret: 'b',
            passphrase: 'c',
            rpcProvider: 'd',
            privateKey: 'e',
        };
        if (!existsSync(polyCliDir)) {
            mkdirSync(polyCliDir);
        }
        writeFileSync(configPath, JSON.stringify(config, null, 4));
    });

    beforeEach(() => {
        configService = new ConfigService();
    });

    afterAll(() => {
        //delete configPath
        unlink(configPath, (err) => {
            if (err) {
                console.error(err);
                return;
            }
        });
    });

    it('should return true for isConfigAvailable', async () => {
        expect(configService.isConfigAvailable()).toBe(true);
    });

    it('should return config with set of mocked values', async () => {
        expect(configService.get('apiKey')).toBe('a');
        expect(configService.get('apiSecret')).toBe('b');
        expect(configService.get('passphrase')).toBe('c');
        expect(configService.get('rpcProvider')).toBe('d');
        expect(configService.get('privateKey')).toBe('e');
    });

    it('should return subset of mocked values', async () => {
        expect(configService.getCreds()).toStrictEqual({
            key: 'a',
            secret: 'b',
            passphrase: 'c'
        });
    });

});