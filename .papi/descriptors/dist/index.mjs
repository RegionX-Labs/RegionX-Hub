// .papi/descriptors/src/common.ts
var table = new Uint8Array(128);
for (let i = 0; i < 64; i++)
  table[i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i * 4 - 205] = i;
var toBinary = (base64) => {
  const n = base64.length,
    bytes = new Uint8Array(
      (((n - Number(base64[n - 1] === '=') - Number(base64[n - 2] === '=')) * 3) / 4) | 0
    );
  for (let i2 = 0, j = 0; i2 < n; ) {
    const c0 = table[base64.charCodeAt(i2++)],
      c1 = table[base64.charCodeAt(i2++)];
    const c2 = table[base64.charCodeAt(i2++)],
      c3 = table[base64.charCodeAt(i2++)];
    bytes[j++] = (c0 << 2) | (c1 >> 4);
    bytes[j++] = (c1 << 4) | (c2 >> 2);
    bytes[j++] = (c2 << 6) | c3;
  }
  return bytes;
};

// .papi/descriptors/src/dot.ts
var descriptorValues = import('./descriptors-YHN2KCHY.mjs').then((module) => module['Dot']);
var metadataTypes = import('./metadataTypes-3ZW77RUG.mjs').then((module) =>
  toBinary('default' in module ? module.default : module)
);
var asset = {};
var getMetadata = () =>
  import('./dot_metadata-DINOA4OL.mjs').then((module) =>
    toBinary('default' in module ? module.default : module)
  );
var genesis = '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3';
var _allDescriptors = { descriptors: descriptorValues, metadataTypes, asset, getMetadata, genesis };
var dot_default = _allDescriptors;

// .papi/descriptors/src/dot_coretime.ts
var descriptorValues2 = import('./descriptors-YHN2KCHY.mjs').then(
  (module) => module['Dot_coretime']
);
var metadataTypes2 = import('./metadataTypes-3ZW77RUG.mjs').then((module) =>
  toBinary('default' in module ? module.default : module)
);
var asset2 = {};
var getMetadata2 = () =>
  import('./dot_coretime_metadata-4RNVDXBT.mjs').then((module) =>
    toBinary('default' in module ? module.default : module)
  );
var genesis2 = '0xefb56e30d9b4a24099f88820987d0f45fb645992416535d87650d98e00f46fc4';
var _allDescriptors2 = {
  descriptors: descriptorValues2,
  metadataTypes: metadataTypes2,
  asset: asset2,
  getMetadata: getMetadata2,
  genesis: genesis2,
};
var dot_coretime_default = _allDescriptors2;

// .papi/descriptors/src/ksm_coretime.ts
var descriptorValues3 = import('./descriptors-YHN2KCHY.mjs').then(
  (module) => module['Ksm_coretime']
);
var metadataTypes3 = import('./metadataTypes-3ZW77RUG.mjs').then((module) =>
  toBinary('default' in module ? module.default : module)
);
var asset3 = {};
var getMetadata3 = () =>
  import('./ksm_coretime_metadata-CERKK3E5.mjs').then((module) =>
    toBinary('default' in module ? module.default : module)
  );
var genesis3 = '0x638cd2b9af4b3bb54b8c1f0d22711fc89924ca93300f0caf25a580432b29d050';
var _allDescriptors3 = {
  descriptors: descriptorValues3,
  metadataTypes: metadataTypes3,
  asset: asset3,
  getMetadata: getMetadata3,
  genesis: genesis3,
};
var ksm_coretime_default = _allDescriptors3;

// .papi/descriptors/src/ksm.ts
var descriptorValues4 = import('./descriptors-YHN2KCHY.mjs').then((module) => module['Ksm']);
var metadataTypes4 = import('./metadataTypes-3ZW77RUG.mjs').then((module) =>
  toBinary('default' in module ? module.default : module)
);
var asset4 = {};
var getMetadata4 = () =>
  import('./ksm_metadata-IWGM6FM5.mjs').then((module) =>
    toBinary('default' in module ? module.default : module)
  );
var genesis4 = '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe';
var _allDescriptors4 = {
  descriptors: descriptorValues4,
  metadataTypes: metadataTypes4,
  asset: asset4,
  getMetadata: getMetadata4,
  genesis: genesis4,
};
var ksm_default = _allDescriptors4;

// .papi/descriptors/src/pas.ts
var descriptorValues5 = import('./descriptors-YHN2KCHY.mjs').then((module) => module['Pas']);
var metadataTypes5 = import('./metadataTypes-3ZW77RUG.mjs').then((module) =>
  toBinary('default' in module ? module.default : module)
);
var asset5 = {};
var getMetadata5 = () =>
  import('./pas_metadata-AD6H57TI.mjs').then((module) =>
    toBinary('default' in module ? module.default : module)
  );
var genesis5 = '0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f';
var _allDescriptors5 = {
  descriptors: descriptorValues5,
  metadataTypes: metadataTypes5,
  asset: asset5,
  getMetadata: getMetadata5,
  genesis: genesis5,
};
var pas_default = _allDescriptors5;

// .papi/descriptors/src/pas_coretime.ts
var descriptorValues6 = import('./descriptors-YHN2KCHY.mjs').then(
  (module) => module['Pas_coretime']
);
var metadataTypes6 = import('./metadataTypes-3ZW77RUG.mjs').then((module) =>
  toBinary('default' in module ? module.default : module)
);
var asset6 = {};
var getMetadata6 = () =>
  import('./pas_coretime_metadata-6QIQVJXN.mjs').then((module) =>
    toBinary('default' in module ? module.default : module)
  );
var genesis6 = '0xc806038cc1d06766f23074ade7c5511326be41646deabc259970ff280c82a464';
var _allDescriptors6 = {
  descriptors: descriptorValues6,
  metadataTypes: metadataTypes6,
  asset: asset6,
  getMetadata: getMetadata6,
  genesis: genesis6,
};
var pas_coretime_default = _allDescriptors6;

// .papi/descriptors/src/wnd.ts
var descriptorValues7 = import('./descriptors-YHN2KCHY.mjs').then((module) => module['Wnd']);
var metadataTypes7 = import('./metadataTypes-3ZW77RUG.mjs').then((module) =>
  toBinary('default' in module ? module.default : module)
);
var asset7 = {};
var getMetadata7 = () =>
  import('./wnd_metadata-CG4TFWZR.mjs').then((module) =>
    toBinary('default' in module ? module.default : module)
  );
var genesis7 = '0xe143f23803ac50e8f6f8e62695d1ce9e4e1d68aa36c1cd2cfd15340213f3423e';
var _allDescriptors7 = {
  descriptors: descriptorValues7,
  metadataTypes: metadataTypes7,
  asset: asset7,
  getMetadata: getMetadata7,
  genesis: genesis7,
};
var wnd_default = _allDescriptors7;

// .papi/descriptors/src/wnd_coretime.ts
var descriptorValues8 = import('./descriptors-YHN2KCHY.mjs').then(
  (module) => module['Wnd_coretime']
);
var metadataTypes8 = import('./metadataTypes-3ZW77RUG.mjs').then((module) =>
  toBinary('default' in module ? module.default : module)
);
var asset8 = {};
var getMetadata8 = () =>
  import('./wnd_coretime_metadata-QFSCAUZK.mjs').then((module) =>
    toBinary('default' in module ? module.default : module)
  );
var genesis8 = '0xf938510edee7c23efa6e9db74f227c827a1b518bffe92e2f6c9842dc53d38840';
var _allDescriptors8 = {
  descriptors: descriptorValues8,
  metadataTypes: metadataTypes8,
  asset: asset8,
  getMetadata: getMetadata8,
  genesis: genesis8,
};
var wnd_coretime_default = _allDescriptors8;

// .papi/descriptors/src/common-types.ts
import { _Enum } from 'polkadot-api';
var DigestItem = _Enum;
var Phase = _Enum;
var DispatchClass = _Enum;
var BagsListListListError = _Enum;
var TokenError = _Enum;
var ArithmeticError = _Enum;
var TransactionalError = _Enum;
var PreimageEvent = _Enum;
var IndicesEvent = _Enum;
var BalanceStatus = _Enum;
var TransactionPaymentEvent = _Enum;
var StakingEvent = _Enum;
var StakingRewardDestination = _Enum;
var StakingForcing = _Enum;
var OffencesEvent = _Enum;
var SessionEvent = _Enum;
var GrandpaEvent = _Enum;
var VersionedLocatableAsset = _Enum;
var XcmV3Junctions = _Enum;
var XcmV3Junction = _Enum;
var XcmV3JunctionNetworkId = _Enum;
var XcmV3JunctionBodyId = _Enum;
var XcmV2JunctionBodyPart = _Enum;
var XcmV3MultiassetAssetId = _Enum;
var DotXcmVersionedLocation = _Enum;
var XcmV2MultilocationJunctions = _Enum;
var XcmV2Junction = _Enum;
var XcmV2NetworkId = _Enum;
var XcmV2BodyId = _Enum;
var ConvictionVotingVoteAccountVote = _Enum;
var PreimagesBounded = _Enum;
var CommonClaimsEvent = _Enum;
var VestingEvent = _Enum;
var BountiesEvent = _Enum;
var ChildBountiesEvent = _Enum;
var ElectionProviderMultiPhaseEvent = _Enum;
var ElectionProviderMultiPhaseElectionCompute = _Enum;
var ElectionProviderMultiPhasePhase = _Enum;
var BagsListEvent = _Enum;
var NominationPoolsPoolState = _Enum;
var NominationPoolsCommissionClaimPermission = _Enum;
var ParachainsInclusionEvent = _Enum;
var ParachainsParasEvent = _Enum;
var ParachainsHrmpEvent = _Enum;
var ParachainsDisputesEvent = _Enum;
var ParachainsDisputeLocation = _Enum;
var ParachainsDisputeResult = _Enum;
var CommonParasRegistrarEvent = _Enum;
var CommonSlotsEvent = _Enum;
var CommonAuctionsEvent = _Enum;
var PolkadotRuntimeParachainsCoretimeEvent = _Enum;
var XcmV4TraitsOutcome = _Enum;
var XcmV3TraitsError = _Enum;
var XcmV4Instruction = _Enum;
var XcmV3MultiassetFungibility = _Enum;
var XcmV3MultiassetAssetInstance = _Enum;
var XcmV4Response = _Enum;
var XcmV3MaybeErrorCode = _Enum;
var XcmV2OriginKind = _Enum;
var XcmV4AssetAssetFilter = _Enum;
var XcmV4AssetWildAsset = _Enum;
var XcmV2MultiassetWildFungibility = _Enum;
var XcmV3WeightLimit = _Enum;
var DotXcmVersionedAssets = _Enum;
var XcmV2MultiassetAssetId = _Enum;
var XcmV2MultiassetFungibility = _Enum;
var XcmV2MultiassetAssetInstance = _Enum;
var ParachainsInclusionAggregateMessageOrigin = _Enum;
var ParachainsInclusionUmpQueueId = _Enum;
var AssetRateEvent = _Enum;
var PolkadotRuntimeOriginCaller = _Enum;
var DispatchRawOrigin = _Enum;
var GovernanceOrigin = _Enum;
var ParachainsOrigin = _Enum;
var XcmPalletOrigin = _Enum;
var PreimageOldRequestStatus = _Enum;
var PreimageRequestStatus = _Enum;
var BabeDigestsNextConfigDescriptor = _Enum;
var BabeAllowedSlots = _Enum;
var BabeDigestsPreDigest = _Enum;
var BalancesTypesReasons = _Enum;
var PreimagePalletHoldReason = _Enum;
var WestendRuntimeRuntimeFreezeReason = _Enum;
var NominationPoolsPalletFreezeReason = _Enum;
var TransactionPaymentReleases = _Enum;
var GrandpaStoredState = _Enum;
var TreasuryPaymentState = _Enum;
var ConvictionVotingVoteVoting = _Enum;
var VotingConviction = _Enum;
var TraitsScheduleDispatchTime = _Enum;
var ClaimsStatementKind = _Enum;
var Version = _Enum;
var BountiesBountyStatus = _Enum;
var ChildBountyStatus = _Enum;
var NominationPoolsClaimPermission = _Enum;
var PolkadotPrimitivesV6ExecutorParamsExecutorParam = _Enum;
var PolkadotPrimitivesV6PvfPrepKind = _Enum;
var PvfExecKind = _Enum;
var ValidityAttestation = _Enum;
var PolkadotPrimitivesV6DisputeStatement = _Enum;
var PolkadotPrimitivesV6ValidDisputeStatementKind = _Enum;
var InvalidDisputeStatementKind = _Enum;
var PolkadotRuntimeParachainsSchedulerPalletCoreOccupied = _Enum;
var PolkadotRuntimeParachainsSchedulerCommonAssignment = _Enum;
var ParachainsParasParaLifecycle = _Enum;
var UpgradeGoAhead = _Enum;
var UpgradeRestriction = _Enum;
var SlashingOffenceKind = _Enum;
var BrokerCoretimeInterfaceCoreAssignment = _Enum;
var MultiSigner = _Enum;
var CommonCrowdloanLastContribution = _Enum;
var XcmPalletQueryStatus = _Enum;
var XcmVersionedResponse = _Enum;
var XcmV2Response = _Enum;
var XcmV2TraitsError = _Enum;
var XcmV3Response = _Enum;
var XcmPalletVersionMigrationStage = _Enum;
var DotXcmVersionedAssetId = _Enum;
var ReferendaTypesCurve = _Enum;
var MultiAddress = _Enum;
var BalancesAdjustmentDirection = _Enum;
var StakingPalletConfigOpBig = _Enum;
var StakingPalletConfigOp = _Enum;
var GrandpaEquivocation = _Enum;
var NominationPoolsBondExtra = _Enum;
var NominationPoolsConfigOp = _Enum;
var MultiSignature = _Enum;
var DotXcmVersionedXcm = _Enum;
var XcmV2Instruction = _Enum;
var XcmV2MultiAssetFilter = _Enum;
var XcmV2MultiassetWildMultiAsset = _Enum;
var XcmV2WeightLimit = _Enum;
var XcmV3Instruction = _Enum;
var XcmV3MultiassetMultiAssetFilter = _Enum;
var XcmV3MultiassetWildMultiAsset = _Enum;
var TransactionValidityError = _Enum;
var TransactionValidityInvalidTransaction = _Enum;
var TransactionValidityUnknownTransaction = _Enum;
var TransactionValidityTransactionSource = _Enum;
var CoreState = _Enum;
var OccupiedCoreAssumption = _Enum;
var CandidateEvent = _Enum;
var MmrPrimitivesError = _Enum;
var RecoveryEvent = _Enum;
var ConvictionVotingEvent = _Enum;
var NominationPoolsEvent = _Enum;
var XcmV5Junctions = _Enum;
var XcmV5Junction = _Enum;
var XcmV5NetworkId = _Enum;
var XcmVersionedLocation = _Enum;
var PolkadotRuntimeCommonAssignedSlotsEvent = _Enum;
var XcmV5Instruction = _Enum;
var XcmV5AssetFilter = _Enum;
var XcmV5WildAsset = _Enum;
var XcmVersionedAssets = _Enum;
var RootTestingEvent = _Enum;
var PolkadotRuntimeCommonIdentityMigratorEvent = _Enum;
var IdentityJudgement = _Enum;
var IdentityData = _Enum;
var WestendRuntimeGovernanceOriginsPalletCustomOriginsOrigin = _Enum;
var XcmVersionedAssetId = _Enum;
var XcmVersionedXcm = _Enum;
var PolkadotRuntimeCommonAssignedSlotsSlotLeasePeriodStart = _Enum;
var XcmVersionedAsset = _Enum;

// .papi/descriptors/src/index.ts
var metadatas = {};
var getMetadata9 = async (codeHash) => {
  try {
    return await metadatas[codeHash].getMetadata();
  } catch {}
  return null;
};
export {
  ArithmeticError,
  AssetRateEvent,
  BabeAllowedSlots,
  BabeDigestsNextConfigDescriptor,
  BabeDigestsPreDigest,
  BagsListEvent,
  BagsListListListError,
  BalanceStatus,
  BalancesAdjustmentDirection,
  BalancesTypesReasons,
  BountiesBountyStatus,
  BountiesEvent,
  BrokerCoretimeInterfaceCoreAssignment,
  CandidateEvent,
  ChildBountiesEvent,
  ChildBountyStatus,
  ClaimsStatementKind,
  CommonAuctionsEvent,
  CommonClaimsEvent,
  CommonCrowdloanLastContribution,
  CommonParasRegistrarEvent,
  CommonSlotsEvent,
  ConvictionVotingEvent,
  ConvictionVotingVoteAccountVote,
  ConvictionVotingVoteVoting,
  CoreState,
  DigestItem,
  DispatchClass,
  DispatchRawOrigin,
  DotXcmVersionedAssetId,
  DotXcmVersionedAssets,
  DotXcmVersionedLocation,
  DotXcmVersionedXcm,
  ElectionProviderMultiPhaseElectionCompute,
  ElectionProviderMultiPhaseEvent,
  ElectionProviderMultiPhasePhase,
  GovernanceOrigin,
  GrandpaEquivocation,
  GrandpaEvent,
  GrandpaStoredState,
  IdentityData,
  IdentityJudgement,
  IndicesEvent,
  InvalidDisputeStatementKind,
  MmrPrimitivesError,
  MultiAddress,
  MultiSignature,
  MultiSigner,
  NominationPoolsBondExtra,
  NominationPoolsClaimPermission,
  NominationPoolsCommissionClaimPermission,
  NominationPoolsConfigOp,
  NominationPoolsEvent,
  NominationPoolsPalletFreezeReason,
  NominationPoolsPoolState,
  OccupiedCoreAssumption,
  OffencesEvent,
  ParachainsDisputeLocation,
  ParachainsDisputeResult,
  ParachainsDisputesEvent,
  ParachainsHrmpEvent,
  ParachainsInclusionAggregateMessageOrigin,
  ParachainsInclusionEvent,
  ParachainsInclusionUmpQueueId,
  ParachainsOrigin,
  ParachainsParasEvent,
  ParachainsParasParaLifecycle,
  Phase,
  PolkadotPrimitivesV6DisputeStatement,
  PolkadotPrimitivesV6ExecutorParamsExecutorParam,
  PolkadotPrimitivesV6PvfPrepKind,
  PolkadotPrimitivesV6ValidDisputeStatementKind,
  PolkadotRuntimeCommonAssignedSlotsEvent,
  PolkadotRuntimeCommonAssignedSlotsSlotLeasePeriodStart,
  PolkadotRuntimeCommonIdentityMigratorEvent,
  PolkadotRuntimeOriginCaller,
  PolkadotRuntimeParachainsCoretimeEvent,
  PolkadotRuntimeParachainsSchedulerCommonAssignment,
  PolkadotRuntimeParachainsSchedulerPalletCoreOccupied,
  PreimageEvent,
  PreimageOldRequestStatus,
  PreimagePalletHoldReason,
  PreimageRequestStatus,
  PreimagesBounded,
  PvfExecKind,
  RecoveryEvent,
  ReferendaTypesCurve,
  RootTestingEvent,
  SessionEvent,
  SlashingOffenceKind,
  StakingEvent,
  StakingForcing,
  StakingPalletConfigOp,
  StakingPalletConfigOpBig,
  StakingRewardDestination,
  TokenError,
  TraitsScheduleDispatchTime,
  TransactionPaymentEvent,
  TransactionPaymentReleases,
  TransactionValidityError,
  TransactionValidityInvalidTransaction,
  TransactionValidityTransactionSource,
  TransactionValidityUnknownTransaction,
  TransactionalError,
  TreasuryPaymentState,
  UpgradeGoAhead,
  UpgradeRestriction,
  ValidityAttestation,
  Version,
  VersionedLocatableAsset,
  VestingEvent,
  VotingConviction,
  WestendRuntimeGovernanceOriginsPalletCustomOriginsOrigin,
  WestendRuntimeRuntimeFreezeReason,
  XcmPalletOrigin,
  XcmPalletQueryStatus,
  XcmPalletVersionMigrationStage,
  XcmV2BodyId,
  XcmV2Instruction,
  XcmV2Junction,
  XcmV2JunctionBodyPart,
  XcmV2MultiAssetFilter,
  XcmV2MultiassetAssetId,
  XcmV2MultiassetAssetInstance,
  XcmV2MultiassetFungibility,
  XcmV2MultiassetWildFungibility,
  XcmV2MultiassetWildMultiAsset,
  XcmV2MultilocationJunctions,
  XcmV2NetworkId,
  XcmV2OriginKind,
  XcmV2Response,
  XcmV2TraitsError,
  XcmV2WeightLimit,
  XcmV3Instruction,
  XcmV3Junction,
  XcmV3JunctionBodyId,
  XcmV3JunctionNetworkId,
  XcmV3Junctions,
  XcmV3MaybeErrorCode,
  XcmV3MultiassetAssetId,
  XcmV3MultiassetAssetInstance,
  XcmV3MultiassetFungibility,
  XcmV3MultiassetMultiAssetFilter,
  XcmV3MultiassetWildMultiAsset,
  XcmV3Response,
  XcmV3TraitsError,
  XcmV3WeightLimit,
  XcmV4AssetAssetFilter,
  XcmV4AssetWildAsset,
  XcmV4Instruction,
  XcmV4Response,
  XcmV4TraitsOutcome,
  XcmV5AssetFilter,
  XcmV5Instruction,
  XcmV5Junction,
  XcmV5Junctions,
  XcmV5NetworkId,
  XcmV5WildAsset,
  XcmVersionedAsset,
  XcmVersionedAssetId,
  XcmVersionedAssets,
  XcmVersionedLocation,
  XcmVersionedResponse,
  XcmVersionedXcm,
  dot_default as dot,
  dot_coretime_default as dot_coretime,
  getMetadata9 as getMetadata,
  ksm_default as ksm,
  ksm_coretime_default as ksm_coretime,
  pas_default as pas,
  pas_coretime_default as pas_coretime,
  wnd_default as wnd,
  wnd_coretime_default as wnd_coretime,
};
