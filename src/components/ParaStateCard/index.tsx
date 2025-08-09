'use client';

import { Tooltip } from 'react-tooltip';
import LabelCard from '../elements/LabelCard/LabelCard';

export enum ParaState {
  RESERVED,
  GENESIS,
  ACTIVE_PARA,
  SYSTEM,
}

type StateInfo = {
  title: string;
  background: string;
  tooltip: string;
  description: string;
};

export const paraStateProperties: Record<ParaState, StateInfo> = {
  [ParaState.RESERVED]: {
    title: 'Reserved',
    background: 'orangeDark',
    tooltip: 'A parachain with a reserved para ID that has not yet been registered.',
    description:
      'The parachain ID has been reserved; however, the genesis state and code of the parachain have not yet been registered. The next step should be to register the code and genesis state.',
  },
  [ParaState.GENESIS]: {
    title: 'At Genesis',
    background: 'pinkDark',
    tooltip: 'The parachain has been registered but has not produced any blocks other than the genesis block.',
    description:
      'The parachain code and genesis state have been registered. The parachain requires Coretime to start producing blocks.',
  },
  [ParaState.ACTIVE_PARA]: {
    title: 'Active Parachain',
    background: 'greenDark',
    tooltip: 'An active parachain that is able to produce blocks.',
    description:
      'A parachain that has registered its code and genesis, and is able to produce blocks if Coretime is allocated to it.',
  },
  [ParaState.SYSTEM]: {
    title: 'System Parachain',
    background: 'yellowDark',
    tooltip: 'Parachain responsible for core Polkadot protocol features.',
    description:
      'A special parachain assigned coretime at the protocol level to run core features of the relay chain.',
  },
};

export const ParaStateCard = ({
  state,
  withTooltip = true,
  renewalStatus,
}: {
  state: ParaState;
  withTooltip?: boolean;
  renewalStatus?: 'needed' | 'done';
}) => {
  const { tooltip, background, title } = paraStateProperties[state];
  const showRenewal = renewalStatus && state !== ParaState.SYSTEM;

  if (!withTooltip) {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}
      >
        {showRenewal && (
          <LabelCard
            label={renewalStatus === 'done' ? 'Renewed' : 'Needs Renewal'}
            color={renewalStatus === 'done' ? 'greenDark' : 'redDark'}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div data-tooltip-id={`tooltip-${state}`} data-tooltip-content={tooltip}>
        <LabelCard label={title} color={background as any} />
      </div>
      <Tooltip id={`tooltip-${state}`} place='top' />
    </>
  );
};
