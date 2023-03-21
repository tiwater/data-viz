import React from 'react';

import { Alert } from '@grafana/ui';
import { t } from 'app/core/internationalization';

export const missingRightsMessage = t(
  'features.datasources.you-are-not-allowed-modify',
  'You are not allowed to modify this data source. Please contact your server admin to update this data source.'
);

export function DataSourceMissingRightsMessage() {
  const missingRightsMessage = t(
    'features.datasources.you-are-not-allowed-modify',
    'You are not allowed to modify this data source. Please contact your server admin to update this data source.'
  );
  return (
    <Alert severity="info" title={t('features.datasources.missing-rights', 'Missing rights')}>
      {missingRightsMessage}
    </Alert>
  );
}
