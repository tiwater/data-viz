import React from 'react';

import { DataSourceSettings } from '@grafana/data';
import { GrafanaEdition } from '@grafana/data/src/types/config';
import { Alert } from '@grafana/ui';
import { LocalStorageValueProvider } from 'app/core/components/LocalStorageValueProvider';
import { config } from 'app/core/config';
import { t } from 'app/core/internationalization';

const LOCAL_STORAGE_KEY = 'datasources.settings.cloudInfoBox.isDismissed';

export interface Props {
  dataSource: DataSourceSettings;
}

export function CloudInfoBox({ dataSource }: Props) {
  let mainDS = '';
  let extraDS = '';

  // don't show for already configured data sources or provisioned data sources
  if (dataSource.readOnly || (dataSource.version ?? 0) > 2) {
    return null;
  }

  // Skip showing this info box in some editions
  if (config.buildInfo.edition !== GrafanaEdition.OpenSource) {
    return null;
  }

  switch (dataSource.type) {
    case 'prometheus':
      mainDS = 'Prometheus';
      extraDS = 'Loki';
      break;
    case 'loki':
      mainDS = 'Loki';
      extraDS = 'Prometheus';
      break;
    default:
      return null;
  }

  return (
    <LocalStorageValueProvider<boolean> storageKey={LOCAL_STORAGE_KEY} defaultValue={false}>
      {(isDismissed, onDismiss) => {
        if (isDismissed) {
          return null;
        }
        return (
          <Alert
            title={t('features.data-source.configure-your-mainDS', 'Configure your {{mainDS}} data source below', {
              mainDS,
            })}
            severity="info"
            bottomSpacing={4}
            onRemove={() => {
              onDismiss(true);
            }}
          >
            {t(
              'features.data-source.or-skip-the-effort-and-get',
              'Or skip the effort and get {{mainDS}} (and {{extraDS}}) as fully-managed, scalable, and hosted data sources',
              { extraDS, mainDS }
            )}
            {/* from
            Grafana Labs with the{' '} */}
            {/* <a
              className="external-link"
              href={`https://grafana.com/signup/cloud/connect-account?src=grafana-oss&cnt=${dataSource.type}-settings`}
              target="_blank"
              rel="noreferrer"
              title="The free plan includes 10k active metrics and 50gb storage."
            >
              
              {t('features.data-source.free-forever-grafana-cloud-plan','free-forever Grafana Cloud plan')}
            </a>
            . */}
          </Alert>
        );
      }}
    </LocalStorageValueProvider>
  );
}
