import {
  TransactDto,
  TableRowDto,
  BalanceDto,
  ResponseTableDto,
  ResponseBalanceDto,
  ResponseAllDto,
} from '../chain/dto';

import { Observable } from 'rxjs';

export namespace utuModuleChain {
  export interface ChainService {
    transact(request: TransactDto): Observable<ResponseAllDto>;
    getTableRows(request: TableRowDto): Observable<ResponseTableDto>;
    getBalance(request: BalanceDto): Observable<ResponseBalanceDto>;
  }
}
