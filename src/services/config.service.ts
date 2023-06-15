import { Injectable } from "@nestjs/common";
import { existsSync, readFileSync, mkdirSync, writeFileSync } from "fs";
import { sep } from "path";
import { homedir } from "os";
import { ApiKeyCreds } from "@polymarket/clob-client";

const polyCliDir = '.polycli';
const configJson = 'config.json';
@Injectable()
export class ConfigService {
    private config: any;
    constructor() {
        this.isConfigAvailable() ? this.loadConfig() : this.createNewConfig();
    }

    isConfigAvailable(): boolean {
        const configPath = homedir() + sep + polyCliDir + sep + configJson;
        return existsSync(configPath);
    }

    loadConfig(): void {
        const configPath = homedir() + sep + polyCliDir + sep + configJson;
        this.config = JSON.parse(readFileSync(configPath, 'utf8'));
    }

    createNewConfig(): void {
        const configPath = homedir() + sep + polyCliDir + sep + configJson;
        this.config = {
            apiKey: '',
            apiSecret: '',
            passphrase: '',
            rpcProvider: '',
            privateKey: '',
        };
        if(!existsSync(homedir() + sep + polyCliDir)){
            mkdirSync(homedir() + sep + polyCliDir);
        }
        writeFileSync(configPath, JSON.stringify(this.config, null, 4));
    }

    get(key: string): string {
        return this.config[key];
    }

    getCreds(): ApiKeyCreds {
        return {
            key: this.config.apiKey,
            secret: this.config.apiSecret,
            passphrase: this.config.passphrase
        }
    }
}