import { $network } from "@/api/connection";
import { ApiResponse, fetchGraphql } from "@/graphql";
import { getNetworkCoretimeIndexer } from "@/network";
import { Network } from "@/types";
import { createEffect, createEvent, createStore, sample } from "effector";

export const burnInfoRequested = createEvent<Network>();

export const $totalBurn = createStore<bigint>(BigInt(0));

type BurnData = {
    totalBurn: string;
    currentBurn: string;
    previousBurn: string;
}

export const fetchBurnInfo = async (network: Network): Promise<ApiResponse> => {
  const query = `{
    stats {
      nodes {
        id
        saleCycle
        totalBurn
      }
    }
    sales(
      orderBy: HEIGHT_DESC,
      first: 2
    ) {
      nodes {
        burn
      }
    }
  }`;
  return fetchGraphql(getNetworkCoretimeIndexer(network), query);
};

const getBurnInfoFx = createEffect(async(network: Network): Promise<BurnData | null> => {
    const res: ApiResponse = await fetchBurnInfo(network);
    const { status, data } = res;
    if (status !== 200) return null;
    console.log(data);

    const {stats, sales} = data;
    const totalBurn = stats.nodes[0]?.totalBurn || '0';
    const currentBurn = sales.nodes[0]?.burn || '0';
    const previousBurn = sales.nodes[1]?.burn || '0';

    const burnData = {totalBurn, currentBurn, previousBurn};
    console.log(burnData);
    return burnData;
});

sample({
    clock: burnInfoRequested,
    target: getBurnInfoFx
});
