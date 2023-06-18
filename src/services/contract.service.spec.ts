import { ConfigService } from './config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ContractService } from './contract.service';

describe('ContractService', () => {
    let contractService: ContractService;
    let configService: ConfigService;
    let moduleRef:TestingModule;
    beforeAll(async () => {
        //mock conifg service
        const configServiceMock = {
            get: (key: string) => {
                return "random string"
            },
            getCreds: () => {
                return {
                    key: 'something',
                    secret: 'secret',
                    passphrase: 'passphrase'
                }
            }
        };
        moduleRef = await Test.createTestingModule({
            providers: [ConfigService],
        }).overrideProvider(ConfigService)
            .useValue(configServiceMock).compile();
    });

    it('should console.log that rpc provider or private key is incorrect', async () => {
        const consoleLogSpy = jest.spyOn(console, 'log');
        configService = moduleRef.get<ConfigService>(ConfigService);
        contractService = new ContractService(configService);
        expect(consoleLogSpy).toHaveBeenCalledWith('Please provide valid private key and rpc provider in config.json file');
    });

});