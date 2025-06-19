'use client';

import { Tooltip } from 'react-tooltip';
import LabelCard from '../elements/LabelCard/LabelCard';

export enum ParaState {
  RESERVED,
  ONBOARDING,
  ONDEMAND_PARACHAIN,
  IDLE_PARA,
  ACTIVE_PARA,
  ACTIVE_RENEWABLE_PARA,
  IN_WORKPLAN,
  LEASE_HOLDING,
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
    tooltip: 'A parachain with a reserved para ID that is not yet registered.',
    description:
      'The parachain ID has been reserved; however, the genesis state and code of the parachain have not yet been registered. The next step should be to register the code and genesis state.',
  },
  [ParaState.ONBOARDING]: {
    title: 'Onboarding',
    background: 'pinkDark',
    tooltip: 'A parachain awaiting code validation.',
    description:
      'The parachain code and genesis state have been registered, and the parachain is now in the onboarding process, during which the registered code is verified before the parachain can go live.',
  },
  [ParaState.ONDEMAND_PARACHAIN]: {
    title: 'On-Demand Parachain',
    background: 'blueDark',
    tooltip: 'Parachain that utilizes on-demand coretime.',
    description:
      'A parachain that purely utilizes on-demand Coretime and does not need to worry about bulk sale cycles.',
  },
  [ParaState.IDLE_PARA]: {
    title: 'Idle Parachain',
    background: 'greenPrimary',
    tooltip: 'A parachain currently not producing blocks.',
    description:
      'A parachain that has registered code and a genesis state but is not producing blocks. It may be awaiting the next bulk sale cycle.',
  },
  [ParaState.ACTIVE_PARA]: {
    title: 'Active Parachain',
    background: 'greenDark',
    tooltip: 'An active parachain that is able to produce blocks.',
    description: 'A parachain that has reserved bulk Coretime and is actively producing blocks.',
  },
  [ParaState.ACTIVE_RENEWABLE_PARA]: {
    title: 'Active Parachain',
    background: 'greenDark',
    tooltip: 'An active parachain that can be renewed and is able to produce blocks.',
    description:
      'A parachain using bulk Coretime that must renew on time during each sale cycle to continue producing blocks.',
  },
  [ParaState.IN_WORKPLAN]: {
    title: 'Idle (In Workplan)',
    background: 'cyanDark',
    tooltip: 'Parachain scheduled for execution',
    description:
      'A parachain waiting for its reserved Coretime to begin. It will start producing blocks soon.',
  },
  [ParaState.LEASE_HOLDING]: {
    title: 'Lease Holding',
    background: 'purpleDark',
    tooltip: 'Parachain that secured coretime through the legacy slot auction model.',
    description:
      'This parachain holds Coretime through the legacy auction system instead of the new Coretime mechanism.',
  },
  [ParaState.SYSTEM]: {
    title: 'System Parachain',
    background: 'yellowDark',
    tooltip: 'Parachain responsible for core Polkadot protocol features.',
    description:
      'A special parachain assigned Coretime at the protocol level to run core features of the relay chain.',
  },
};

export const ParaStateCard = ({
  state,
  withTooltip = true,
}: {
  state: ParaState;
  withTooltip?: boolean;
}) => {
  const { tooltip, background, title } = paraStateProperties[state];

  if (!withTooltip) {
    return <LabelCard label={title} color={background as any} />;
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
