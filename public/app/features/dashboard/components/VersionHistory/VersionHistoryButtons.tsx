import React from 'react';

import { Stack } from '@grafana/experimental';
import { Tooltip, Button } from '@grafana/ui';
import { t } from 'app/core/internationalization';

type VersionsButtonsType = {
  hasMore: boolean;
  canCompare: boolean;
  getVersions: (append: boolean) => void;
  getDiff: () => void;
  isLastPage: boolean;
};
export const VersionsHistoryButtons: React.FC<VersionsButtonsType> = ({
  hasMore,
  canCompare,
  getVersions,
  getDiff,
  isLastPage,
}) => (
  <Stack>
    {hasMore && (
      <Button type="button" onClick={() => getVersions(true)} variant="secondary" disabled={isLastPage}>
        {t('features.variables.editor.show-more-versions', 'Show more versions')}
      </Button>
    )}
    <Tooltip
      content={t(
        'features.variables.editor.select-two-versions-to-start-comparing',
        'Select two versions to start comparing'
      )}
      placement="bottom"
    >
      <Button type="button" disabled={!canCompare} onClick={getDiff} icon="code-branch">
        {t('features.variables.editor.compare-versions', 'Compare versions')}
      </Button>
    </Tooltip>
  </Stack>
);
