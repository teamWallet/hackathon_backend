import { Injectable } from '@nestjs/common';
import ConfigLoader from './config-loader';
import { DacDirectory } from './dacdirectory';
import EosApi from './eosapi';
export interface ModuleConfig {
  [key: string]: any;
}

@Injectable()
export class ConfigService {
  [key: string]: ((...args: any[]) => any) | any;

  private localConfig: ConfigLoader;
  private dir: DacDirectory;
  private eosapi;

  async onModuleInit(): Promise<void> {
    await this.load();
  }

  constructor() {
    this.localConfig = new ConfigLoader();
    this.eosapi = EosApi(this.localConfig);
    this.dir = new DacDirectory(this.eosapi, this.localConfig);
    // this.dir.reload();
  }

  async load(dacId = ''): Promise<ConfigService> {
    const config = new ConfigService();
    // await this.dir.reload(dacId);
    return config;
  }

  getLocalConfig(): ConfigLoader {
    return this.localConfig;
  }

  async getDir(dacId = ''): Promise<DacDirectory> {
    // if (dacId !== this.dir.getDacId()) {
    //   await this.dir.reload(dacId);
    // }
    return this.dir;
  }

  getEosApi() {
    return this.eosapi;
  }
}
