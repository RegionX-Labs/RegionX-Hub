const SAFE_XCM_VERSION = 4;
const CORETIME_PARA_ID = 1005;

export const CoretimeChainFromRelayPerspective = {
  parents: 0,
  interior: {
    X1: {
      Parachain: CORETIME_PARA_ID,
    },
  },
};

export const RcTokenFromParachainPerspective = {
  parents: 1,
  interior: 'Here',
};

export const versionWrap = (xcm: any) => {
  return {
    [`V${SAFE_XCM_VERSION}`]: xcm,
  };
};

export const nonFungibleAsset = (assetLocation: any, index: string) => {
  return {
    id: {
      Concrete: assetLocation,
    },
    fun: {
      NonFungible: {
        Index: index,
      },
    },
  };
};

export const fungibleAsset = (assetLocation: any, amount: string) => {
  return {
    id: {
      Concrete: assetLocation,
    },
    fun: {
      Fungible: amount,
    },
  };
};
