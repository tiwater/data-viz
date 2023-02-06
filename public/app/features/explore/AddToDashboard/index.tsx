import React, { useState } from 'react';

import { ToolbarButton } from '@grafana/ui';
import { Trans } from 'app/core/internationalization';
import { ExploreId, useSelector } from 'app/types';

import { getExploreItemSelector } from '../state/selectors';

import { AddToDashboardModal } from './AddToDashboardModal';

interface Props {
  exploreId: ExploreId;
}

export const AddToDashboard = ({ exploreId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectExploreItem = getExploreItemSelector(exploreId);
  const explorePaneHasQueries = !!useSelector(selectExploreItem)?.queries?.length;

  return (
    <>
      <ToolbarButton
        icon="apps"
        variant="canvas"
        onClick={() => setIsOpen(true)}
        aria-label="Add to dashboard"
        disabled={!explorePaneHasQueries}
      >
        <Trans i18nKey="explore.add-to-dashboard-button">Add to dashboard</Trans>
      </ToolbarButton>

      {isOpen && <AddToDashboardModal onClose={() => setIsOpen(false)} exploreId={exploreId} />}
    </>
  );
};
