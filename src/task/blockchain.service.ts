import { forwardRef, Inject, Injectable, HttpStatus } from '@nestjs/common';

import { AppLogger } from '../logger/logger';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiException, ApiMsgCode } from '../shared';
import {
  TaskPublishRequest,
  NormalResponse,
} from './dto';
import { ContractDto } from './dto/req/contract.dto';
import {
  toChainEntityName,
  toChainAsset,
  toChainSymbol,
  toChainAssetFromSymbolCode,
  toChainDate,
  toChainSymbolCode,
} from '../utils';
import { ChainService } from 'src/chain/chain.service';
import { CancelContractInfo } from 'src/chain/interfaces/contract/cancelContract.inferface';
import { AcceptContractInfo } from 'src/chain/interfaces/contract/acceptContract.inferface';
import { CreateContractInfo } from 'src/chain/interfaces/contract/createContract.inferface';
import { BurnContractInfo } from 'src/chain/interfaces/contract/burnContract.inferface';
import { ApproveContractInfo } from 'src/chain/interfaces/contract/approveContract.inferface';
import { PayContractInfo } from 'src/chain/interfaces/contract/payContract.inferface';
import { ExtendedAssetDto } from 'src/chain/dto/comm/extendedAsset.dto';
import { ConfigService } from 'src/config/config.service';
import { AccountService } from 'src/account/account.service';

@Injectable()
export class BlockChainService {
  constructor(
    private logger: AppLogger,
    private chainService: ChainService,
    private configService: ConfigService,
    @Inject(forwardRef(() => AccountService))
    private accountService: AccountService
  ) {}
// 1.0000 
// createcontract - 创建雇佣关系，参数：合约唯一 Id, 雇佣者, 被雇佣者, title, content, content_hash,pay_asset
// cancelcontract - 取消雇佣关系，仅在 accept 之前可以单向取消，参数: 合约唯一 Id, canceler
// acceptcontract - 接受雇佣关系, 参数: 合约唯一 Id, accepter
// approved - 审核通过, 参数: 合约唯一 Id, caller
// burn - 销毁代币, 参数: name, asset
// pay - 支付, 参数: 合约唯一 Id, payer, payment


// 1）token冻结和解冻，销毁 
// 2）文章手动或自动发布，触发30%稿酬支付 
// 3）点赞操作到预定值50%，支付30% 
// 4）点赞操作到预定值100%，支付剩余40%

  async createContract(body: ContractDto): Promise<string> {
    this.logger.debug(`publish body: ${JSON.stringify(body)}`);
    try {
      const contractName = this.configService.getLocalConfig().get('dactokencontract');
      const extendedAsset: ExtendedAssetDto = {
        contract: toChainEntityName(contractName),
        quantity: toChainAssetFromSymbolCode(body.amount, 'VOS', 4)
      };

      const info: CreateContractInfo = {
        contractId: toChainEntityName(body.id),
        partyA: toChainEntityName(body.callerId),
        partyB: toChainEntityName(body.authorId),
        title: body.title,
        content: body.content,
        contentHash: body.hash,
        contractPay: extendedAsset
      }

      await this.chainService.createContract(info)

      return 'success'
    } catch (e) {
      console.error('createContract exception', e);
      throw new ApiException(
        'task createContract failed',
        ApiMsgCode.TASK_PUBLISH_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async cancelContract(contractId: string, name: string): Promise<string> {
    try {

      const info: CancelContractInfo = {
        contractId: toChainEntityName(contractId),
        canceler: toChainEntityName(name)
      }

      await this.chainService.cancelContract(info);

      return 'success';
    } catch (e) {
      console.error('cancelContract exception', e);
      throw new ApiException(
        'task cancelContract failed',
        ApiMsgCode.TASK_PUBLISH_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async acceptContract(contractId: string, name: string): Promise<string> {
    try {
      const info: AcceptContractInfo = {
        contractId: toChainEntityName(contractId),
        accepter: toChainEntityName(name)
      }
      
      await this.chainService.acceptContract(info);

      return 'success';
    } catch (e) {
      console.error('acceptContract exception', e);
      throw new ApiException(
        'task acceptContract failed',
        ApiMsgCode.TASK_PUBLISH_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // 
  async approve(contractId: string, name: string): Promise<string> {
    try {
      const info: ApproveContractInfo = {
        contractId: toChainEntityName(contractId),
        approver: toChainEntityName(name)
      }
      
      await this.chainService.approvedContract(info);

      return 'success';
    } catch (e) {
      console.error('approve exception', e);
      throw new ApiException(
        'task approve failed',
        ApiMsgCode.TASK_PUBLISH_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  /**
   * 
   * @param name 
   * @param amount 1.000
   */
  async burn(name: string, amount: string): Promise<string> {
    try {
      const info: BurnContractInfo = {
        beBurner: toChainEntityName(name),
        quantity: toChainAssetFromSymbolCode(amount, 'VOS', 4)
      }

      await this.chainService.burn(info);
      return 'success';
    } catch (e) {
      console.error('burn exception', e);
      throw new ApiException(
        'chain burn failed',
        ApiMsgCode.TASK_PUBLISH_FAILED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * 
   * @param contractId 
   * @param name 
   * @param amount 
   */
  async pay(contractId: string, name: string, amount: string): Promise<string> {
    try {
      console.log(arguments);
      
      const contractName = this.configService.getLocalConfig().get('dactokencontract');
      const extendedAsset: ExtendedAssetDto = {
        contract: toChainEntityName(contractName),
        quantity: toChainAssetFromSymbolCode(amount, 'VOS', 4)
      };
      
      console.log(extendedAsset);
      
      const info: PayContractInfo = {
        contractId: toChainEntityName(contractId),
        payer: toChainEntityName(name),
        payment: extendedAsset
      }

      console.log(info);
      
      await this.chainService.payContract(info);

      return 'success';
    } catch (e) {
      throw e;
    }
  }

  /**
   * 
   * @param contractId 
   * @param sender 
   * @param receive 
   * @param amount 
   */
  async pay2(contractId: string, sender: string, 
    receiver: string, amount: string): Promise<string> {

    const extra = JSON.stringify({
      "contractId": contractId,
      "sender": sender,
      "receiver": receiver,
      "amount": amount
    });

    const giveRewardsDto = {
      "name" : receiver,
      "type" : "writingReward",
      "rewards" : Number(amount),
      "extra" : extra
    }
    await this.accountService.giveRewards(giveRewardsDto);

    return ''
  }

  /**
   * create contract id 
   */
  randomName() {
    let name = '';
    const possible = 'abcdefghijklmnopqrstuvwxyz12345';
    for (let i = 0; i < 12; i++) {
      name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return toChainEntityName(name);
  }

}
