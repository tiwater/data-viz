import { css } from '@emotion/css';
import React, { useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { DataSourcePicker } from '@grafana/runtime';
import { Button, InlineField, InlineSwitch, Input } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { ExemplarTraceIdDestination } from '../types';

type Props = {
  value: ExemplarTraceIdDestination;
  onChange: (value: ExemplarTraceIdDestination) => void;
  onDelete: () => void;
  disabled?: boolean;
};

export default function ExemplarSetting({ value, onChange, onDelete, disabled }: Props) {
  const [isInternalLink, setIsInternalLink] = useState(Boolean(value.datasourceUid));

  return (
    <div className="gf-form-group">
      <InlineField
        label={t('app.plugins.data-source.internal-link', 'Internal link')}
        labelWidth={24}
        disabled={disabled}
      >
        <>
          <InlineSwitch
            value={isInternalLink}
            aria-label={selectors.components.DataSource.Prometheus.configPage.internalLinkSwitch}
            onChange={(ev) => setIsInternalLink(ev.currentTarget.checked)}
          />
          {!disabled && (
            <Button
              variant="destructive"
              title={t('app.plugins.data-source.remove-link', 'Remove link')}
              icon="times"
              onClick={(event) => {
                event.preventDefault();
                onDelete();
              }}
              className={css`
                margin-left: 8px;
              `}
            />
          )}
        </>
      </InlineField>

      {isInternalLink ? (
        <InlineField
          label={t('app.plugins.data-source.data-source', 'Data source')}
          labelWidth={24}
          tooltip={t(
            'app.plugins.data-source.the-data-source-the-exemplar-is-going-to-navigate',
            'The data source the exemplar is going to navigate to.'
          )}
          disabled={disabled}
        >
          <DataSourcePicker
            tracing={true}
            current={value.datasourceUid}
            noDefault={true}
            width={40}
            onChange={(ds) =>
              onChange({
                ...value,
                datasourceUid: ds.uid,
                url: undefined,
              })
            }
          />
        </InlineField>
      ) : (
        <InlineField
          label={t('app.plugins.data-source.URL', 'URL')}
          labelWidth={24}
          tooltip={t(
            'app.plugins.data-source.the-URL-of-the-trace-backend-the-user-would',
            'The URL of the trace backend the user would go to see its trace.'
          )}
          disabled={disabled}
        >
          <Input
            placeholder="https://example.com/${__value.raw}"
            spellCheck={false}
            width={40}
            value={value.url}
            onChange={(event) =>
              onChange({
                ...value,
                datasourceUid: undefined,
                url: event.currentTarget.value,
              })
            }
          />
        </InlineField>
      )}

      <InlineField
        label={t('app.plugins.data-source.URL-label', 'URL Label')}
        labelWidth={24}
        tooltip={t(
          'app.plugins.data-source.use-to-override-the-button-label-on-the',
          'Use to override the button label on the exemplar traceID field.'
        )}
        disabled={disabled}
      >
        <Input
          placeholder={t('app.plugins.data-source.go-to-example-com', 'Go to example.com')}
          spellCheck={false}
          width={40}
          value={value.urlDisplayLabel}
          onChange={(event) =>
            onChange({
              ...value,
              urlDisplayLabel: event.currentTarget.value,
            })
          }
        />
      </InlineField>
      <InlineField
        label={t('app.plugins.data-source.label-name', 'Label name')}
        labelWidth={24}
        tooltip={t(
          'app.plugins.data-source.the-name-of-the-field-in-the-labels',
          'The name of the field in the labels object that should be used to get the traceID.'
        )}
        disabled={disabled}
      >
        <Input
          placeholder={t('app.plugins.data-source.traceID', 'traceID')}
          spellCheck={false}
          width={40}
          value={value.name}
          onChange={(event) =>
            onChange({
              ...value,
              name: event.currentTarget.value,
            })
          }
        />
      </InlineField>
    </div>
  );
}
