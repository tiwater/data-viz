import React from 'react';
import { valid } from 'semver';

import { DataSourceSettings, SelectableValue, isTruthy } from '@grafana/data';
import { FieldSet, InlineField, Input, Select, InlineSwitch } from '@grafana/ui';
import { t, Trans } from 'app/core/internationalization';

import { ElasticsearchOptions, Interval } from '../types';

const esVersions: SelectableValue[] = [
  { label: '7.10+', value: '7.10.0' },
  { label: '8.x', value: '8.0.0' },
];

type Props = {
  value: DataSourceSettings<ElasticsearchOptions>;
  onChange: (value: DataSourceSettings<ElasticsearchOptions>) => void;
};
export const ElasticDetails = ({ value, onChange }: Props) => {
  const indexPatternTypes: Array<SelectableValue<'none' | Interval>> = [
    { label: t('app.plugins.data-source.no-pattern', 'No pattern'), value: 'none' },
    { label: t('app.plugins.data-source.hourly', 'Hourly'), value: 'Hourly', example: '[logstash-]YYYY.MM.DD.HH' },
    { label: t('app.plugins.data-source.daily', 'Daily'), value: 'Daily', example: '[logstash-]YYYY.MM.DD' },
    { label: t('app.plugins.data-source.weekly', 'Weekly'), value: 'Weekly', example: '[logstash-]GGGG.WW' },
    { label: t('app.plugins.data-source.monthly', 'Monthly'), value: 'Monthly', example: '[logstash-]YYYY.MM' },
    { label: t('app.plugins.data-source.yearly', 'Yearly'), value: 'Yearly', example: '[logstash-]YYYY' },
  ];
  const currentVersion = esVersions.find((version) => version.value === value.jsonData.esVersion);
  const customOption =
    !currentVersion && valid(value.jsonData.esVersion)
      ? {
          label: value.jsonData.esVersion,
          value: value.jsonData.esVersion,
        }
      : undefined;
  return (
    <>
      <FieldSet label={t('app.plugins.data-source.elasticsearch-details', 'Elasticsearch details')}>
        <InlineField label={t('app.plugins.data-source.index-name', 'Index name')} labelWidth={26}>
          <Input
            id="es_config_indexName"
            value={value.database || ''}
            onChange={changeHandler('database', value, onChange)}
            width={24}
            placeholder="es-index-name"
            required
          />
        </InlineField>

        <InlineField label={t('app.plugins.data-source.pattern', 'Pattern')} labelWidth={26}>
          <Select
            inputId="es_config_indexPattern"
            value={indexPatternTypes.find(
              (pattern) => pattern.value === (value.jsonData.interval === undefined ? 'none' : value.jsonData.interval)
            )}
            options={indexPatternTypes}
            onChange={intervalHandler(value, onChange)}
            width={24}
          />
        </InlineField>

        <InlineField label={t('app.plugins.data-source.time-field-name', 'Time field name')} labelWidth={26}>
          <Input
            id="es_config_timeField"
            value={value.jsonData.timeField || ''}
            onChange={jsonDataChangeHandler('timeField', value, onChange)}
            width={24}
            placeholder="@timestamp"
            required
          />
        </InlineField>

        <InlineField
          label={t('app.plugins.data-source.elasticSearch-version', 'ElasticSearch version')}
          labelWidth={26}
        >
          <Select
            inputId="es_config_version"
            options={[customOption, ...esVersions].filter(isTruthy)}
            onChange={(option) => {
              const maxConcurrentShardRequests = getMaxConcurrenShardRequestOrDefault(
                value.jsonData.maxConcurrentShardRequests
              );
              onChange({
                ...value,
                jsonData: {
                  ...value.jsonData,
                  esVersion: option.value!,
                  maxConcurrentShardRequests,
                },
              });
            }}
            value={currentVersion || customOption}
            width={24}
          />
        </InlineField>

        <InlineField
          label={t('app.plugins.data-source.max-concurrent-shard-requests', 'Max concurrent Shard Requests')}
          labelWidth={26}
        >
          <Input
            id="es_config_shardRequests"
            value={value.jsonData.maxConcurrentShardRequests || ''}
            onChange={jsonDataChangeHandler('maxConcurrentShardRequests', value, onChange)}
            width={24}
          />
        </InlineField>

        <InlineField
          label={t('app.plugins.data-source.min-time-interval', 'Min time interval')}
          labelWidth={26}
          tooltip={
            <Trans i18nKey="app.plugins.data-source.elasticSearch-lower-limit-for-the-auto">
              A lower limit for the auto group by time interval. Recommended to be set to write frequency, for example{' '}
              <code>1m</code> if your data is written every minute.
            </Trans>
          }
          error={t(
            'app.plugins.data-source.elasticSearch-value-is-not-valid',
            'Value is not valid, you can use number with time unit specifier: y, M, w, d, h, m, s'
          )}
          invalid={!!value.jsonData.timeInterval && !/^\d+(ms|[Mwdhmsy])$/.test(value.jsonData.timeInterval)}
        >
          <Input
            id="es_config_minTimeInterval"
            value={value.jsonData.timeInterval || ''}
            onChange={jsonDataChangeHandler('timeInterval', value, onChange)}
            width={24}
            placeholder="10s"
          />
        </InlineField>

        <InlineField label={t('app.plugins.data-source.x-pack-enabled', 'Include Frozen Indices')} labelWidth={26}>
          <InlineSwitch
            id="es_config_frozenIndices"
            value={(value.jsonData.xpack ?? false) && (value.jsonData.includeFrozen ?? false)}
            onChange={(event) => includeFrozenIndicesOnChange(event.currentTarget.checked, value, onChange)}
          />
        </InlineField>
      </FieldSet>
    </>
  );
};

// TODO: Use change handlers from @grafana/data
const changeHandler =
  (key: keyof DataSourceSettings<ElasticsearchOptions>, value: Props['value'], onChange: Props['onChange']) =>
  (event: React.SyntheticEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({
      ...value,
      [key]: event.currentTarget.value,
    });
  };

// TODO: Use change handlers from @grafana/data
const jsonDataChangeHandler =
  (key: keyof ElasticsearchOptions, value: Props['value'], onChange: Props['onChange']) =>
  (event: React.SyntheticEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange({
      ...value,
      jsonData: {
        ...value.jsonData,
        [key]: event.currentTarget.value,
      },
    });
  };

const includeFrozenIndicesOnChange = (newValue: boolean, formValue: Props['value'], onChange: Props['onChange']) => {
  const newJsonData = { ...formValue.jsonData };
  if (newValue) {
    newJsonData.xpack = true;
    newJsonData.includeFrozen = true;
  } else {
    delete newJsonData.xpack;
    delete newJsonData.includeFrozen;
  }
  onChange({
    ...formValue,
    jsonData: newJsonData,
  });
};

const intervalHandler =
  (value: Props['value'], onChange: Props['onChange']) => (option: SelectableValue<Interval | 'none'>) => {
    const { database } = value;
    // If option value is undefined it will send its label instead so we have to convert made up value to undefined here.
    const newInterval = option.value === 'none' ? undefined : option.value;

    if (!database || database.length === 0 || database.startsWith('[logstash-]')) {
      let newDatabase = '';

      if (newInterval !== undefined) {
        const pattern = indexPatternTypes.find((pattern) => pattern.value === newInterval);

        if (pattern) {
          newDatabase = pattern.example ?? '';
        }
      }

      onChange({
        ...value,
        database: newDatabase,
        jsonData: {
          ...value.jsonData,
          interval: newInterval,
        },
      });
    } else {
      onChange({
        ...value,
        jsonData: {
          ...value.jsonData,
          interval: newInterval,
        },
      });
    }
  };

function getMaxConcurrenShardRequestOrDefault(maxConcurrentShardRequests: number | undefined): number {
  if (maxConcurrentShardRequests === 256) {
    return 5;
  }

  return maxConcurrentShardRequests || defaultMaxConcurrentShardRequests();
}

export function defaultMaxConcurrentShardRequests() {
  return 5;
}
