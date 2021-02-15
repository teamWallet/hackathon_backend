export interface CustodianConfig {
  lockupasset: {
    quantity: string;
    contract: string;
  };
  maxvotes: number;
  numelected: number;
  periodlength: number;
  shouldPayViaServiceProvider: number;
  initialVoteQuorumPercent: number;
  voteQuorumPercent: number;
  authThresholdHigh: number;
  authThresholdMid: number;
  authThresholdLow: number;
  lockupReleaseTimeDelay: number;
  requestedPayMax: {
    quantity: string;
    contract: string;
  };
}
