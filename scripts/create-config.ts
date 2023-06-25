import { existsSync, mkdirSync, writeFileSync } from "fs";
import { sep } from 'path';
import { homedir } from 'os';

const polyCliDir = '.pmarket-cli';
const configJson = 'config.json';

const configPath = homedir() + sep + polyCliDir + sep + configJson;
const config = {
    apiKey: '',
    apiSecret: '',
    passphrase: '',
    rpcProvider: '',
    privateKey: '',
};
if (!existsSync(homedir() + sep + polyCliDir)) {
    mkdirSync(homedir() + sep + polyCliDir);
}

if (!existsSync(configPath)) {
    writeFileSync(configPath, JSON.stringify(config, null, 4));
    console.log('Configuration file created:', configPath);
}

