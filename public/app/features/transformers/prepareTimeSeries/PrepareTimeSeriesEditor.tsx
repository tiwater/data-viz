import { css } from '@emotion/css';
import React, { useCallback } from 'react';

import { GrafanaTheme2, SelectableValue, TransformerRegistryItem, TransformerUIProps } from '@grafana/data';
import { InlineField, InlineFieldRow, Select, useStyles2 } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { prepareTimeSeriesTransformer, PrepareTimeSeriesOptions, timeSeriesFormat } from './prepareTimeSeries';

export function PrepareTimeSeriesEditor(props: TransformerUIProps<PrepareTimeSeriesOptions>): React.ReactElement {
  const wideInfo = {
    label: t('features.transformers.prepare-time-series.wideInfo-name', 'Wide time series'),
    value: timeSeriesFormat.TimeSeriesWide,
    description: t(
      'features.transformers.prepare-time-series.wideInfo-description',
      'Creates a single frame joined by time'
    ),
    info: (
      <ul>
        <li>{t('features.transformers.prepare-time-series.single-frames', 'Single frames')}</li>
        <li>{t('features.transformers.prepare-time-series.field-is-time-field', '1st field is time field')}</li>
        <li>{t('features.transformers.prepare-time-series.time-in-ascending-order', 'Time in ascending order')}</li>
        <li>
          {t(
            'features.transformers.prepare-time-series.multiple-value-fields-of-any-type',
            'Multiple value fields of any type'
          )}
        </li>
      </ul>
    ),
  };

  const multiInfo = {
    label: t('features.transformers.prepare-time-series.multiInfo-name', 'Multi-frame time series'),
    value: timeSeriesFormat.TimeSeriesMulti,
    description: t(
      'features.transformers.prepare-time-series.multiInfo-description',
      'Creates a new frame for each time/number pair'
    ),
    info: (
      <ul>
        <li>{t('features.transformers.prepare-time-series.multiple-frames', 'Multiple frames')}</li>
        <li>
          {t(
            'features.transformers.prepare-time-series.each-frame-has-two-fields',
            'Each frame has two fields: time, value'
          )}
        </li>
        <li>{t('features.transformers.prepare-time-series.time-in-ascending-order', 'Time in ascending order')}</li>
        <li>
          {t(
            'features.transformers.prepare-time-series.string-values-are-represented',
            'String values are represented as labels'
          )}
        </li>
        <li>{t('features.transformers.prepare-time-series.all-values-are-numeric', 'All values are numeric')}</li>
      </ul>
    ),
  };

  const longInfo = {
    label: t('features.transformers.prepare-time-series.longInfo-name', 'Long time series'),
    value: timeSeriesFormat.TimeSeriesLong,
    description: t(
      'features.transformers.prepare-time-series.longInfo-description',
      'Convert each frame to long format'
    ),
    info: (
      <ul>
        <li>{t('features.transformers.prepare-time-series.single-frames', 'Single frames')}</li>
        <li>{t('features.transformers.prepare-time-series.field-is-time-field', '1st field is time field')}</li>
        <li>
          {t('features.transformers.prepare-time-series.time-in-ascending-order', 'Time in ascending order')},{' '}
          {t('features.transformers.prepare-time-series.but-may-have-duplicates', 'but may have duplicates')}
        </li>
        <li>
          {t(
            'features.transformers.prepare-time-series.separate-fields-rather',
            'String values are represented as separate fields rather than as labels'
          )}
        </li>
        <li>
          {t(
            'features.transformers.prepare-time-series.multiple-value-fields-may-exist',
            'Multiple value fields may exist'
          )}
        </li>
      </ul>
    ),
  };

  const formats: Array<SelectableValue<timeSeriesFormat>> = [wideInfo, multiInfo, longInfo];
  const { options, onChange } = props;
  const styles = useStyles2(getStyles);

  const onSelectFormat = useCallback(
    (value: SelectableValue<timeSeriesFormat>) => {
      onChange({
        ...options,
        format: value.value!,
      });
    },
    [onChange, options]
  );

  return (
    <>
      <InlineFieldRow>
        <InlineField label="Format" labelWidth={12}>
          <Select
            width={35}
            options={formats}
            value={
              formats.find((v) => {
                // migrate previously selected timeSeriesMany to multi
                if (
                  v.value === timeSeriesFormat.TimeSeriesMulti &&
                  options.format === timeSeriesFormat.TimeSeriesMany
                ) {
                  return true;
                } else {
                  return v.value === options.format;
                }
              }) || formats[0]
            }
            onChange={onSelectFormat}
            className="flex-grow-1"
          />
        </InlineField>
      </InlineFieldRow>
      <InlineFieldRow>
        <InlineField label="Info" labelWidth={12}>
          <div className={styles.info}>{(formats.find((v) => v.value === options.format) || formats[0]).info}</div>
        </InlineField>
      </InlineFieldRow>
    </>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  info: css`
    margin-left: 20px;
  `,
});

export const getPrepareTimeseriesTransformerRegistryItem = (): TransformerRegistryItem<PrepareTimeSeriesOptions> => ({
  id: prepareTimeSeriesTransformer.id,
  editor: PrepareTimeSeriesEditor,
  transformation: prepareTimeSeriesTransformer,
  name: t('features.transformers.prepare-time-series.name', 'Prepare time series'),
  description: t(
    'features.transformers.prepare-time-series.description',
    'Will stretch data frames from the wide format into the long format. This is really helpful to be able to keep backwards compatibility for panels not supporting the new wide format.'
  ),
  help: `
  ### ${t('features.transformers.rows-to-fields.use-cases', 'Use cases')} 

  ${t(
    'features.transformers.prepare-time-series.this-takes-query',
    'This takes query results and transforms them into a predictable time series format.'
  )}
  ${t(
    'features.transformers.prepare-time-series.this-transformer-may',
    'This transformer may be especially useful when using old panels that only expect the many-frame timeseries format.'
  )}
  
  
  `,
});

export const prepareTimeseriesTransformerRegistryItem: TransformerRegistryItem<PrepareTimeSeriesOptions> = {
  id: prepareTimeSeriesTransformer.id,
  editor: PrepareTimeSeriesEditor,
  transformation: prepareTimeSeriesTransformer,
  name: prepareTimeSeriesTransformer.name,
  description: prepareTimeSeriesTransformer.description,
  help: `
  ### Use cases

  This takes query results and transforms them into a predictable timeseries format.
  This transformer may be especially useful when using old panels that only expect the
  many-frame timeseries format.
  `,
};
