import { Test, TestingModule } from '@nestjs/testing';
import { ChainService } from './chain.service';
import { ActionsHelperService } from './actionsHelper.service';
import { ConfigService } from '../config/config.service';
import { NotaddGrpcClientFactory } from '../grpc/grpc.client-factory';

describe('ChainService', () => {
  let service: ChainService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        NotaddGrpcClientFactory,
        ActionsHelperService,
        ChainService,
      ],
    }).compile();

    service = module.get<ChainService>(ChainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
