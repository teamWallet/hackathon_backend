import { Injectable } from '@nestjs/common';
import {
  Client,
  ClientGrpc,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import * as config from 'config';

export function generateGrpcOptions(
  url: string,
  packageName: string,
  protoFileName: string,
): GrpcOptions {
  return {
    transport: Transport.GRPC,
    options: {
      url,
      package: packageName,
      protoPath: join(__dirname, '../../src/grpc/protobufs/' + protoFileName),
      loader: {
        // arrays: true,
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
      },
    },
  };
}
@Injectable()
export class NotaddGrpcClientFactory {

  @Client(
    generateGrpcOptions(
      config.get<string>('grpc.module_chain'),
      'utu_module_chain',
      'utu-module-chain.proto',
    ),
  )
  public readonly chainModuleClient: ClientGrpc;
}
