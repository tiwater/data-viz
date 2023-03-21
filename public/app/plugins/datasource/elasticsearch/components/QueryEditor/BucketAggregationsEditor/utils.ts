import { InternalTimeZones, SelectableValue } from '@grafana/data';
import { t } from 'app/core/internationalization';

import { BucketsConfiguration } from '../../../types';

import { defaultFilter } from './SettingsEditor/FiltersSettingsEditor/utils';

export const bucketAggregationConfig = (): BucketsConfiguration => ({
  terms: {
    label: t('plugins.data-source.terms', 'Terms'),
    requiresField: true,
    defaultSettings: {
      min_doc_count: '1',
      size: '10',
      order: 'desc',
      orderBy: '_term',
    },
  },
  filters: {
    label: t('plugins.data-source.filters', 'Filters'),
    requiresField: false,
    defaultSettings: {
      filters: [defaultFilter()],
    },
  },
  geohash_grid: {
    label: t('plugins.data-source.geo-hash-grid', 'Geo Hash Grid'),
    requiresField: true,
    defaultSettings: {
      precision: '3',
    },
  },
  date_histogram: {
    label: t('plugins.data-source.date-histogram', 'Date Histogram'),
    requiresField: true,
    defaultSettings: {
      interval: 'auto',
      min_doc_count: '0',
      trimEdges: '0',
      timeZone: InternalTimeZones.utc,
    },
  },
  histogram: {
    label: t('plugins.data-source.histogram', 'Histogram'),
    requiresField: true,
    defaultSettings: {
      interval: '1000',
      min_doc_count: '0',
    },
  },
});

export const orderByOptions = (): Array<SelectableValue<string>> => [
  { label: t('plugins.data-source.term-value', 'Term value'), value: '_term' },
  { label: t('plugins.data-source.doc-count', 'Doc Count'), value: '_count' },
];

export const orderOptions = (): Array<SelectableValue<string>> => [
  { label: t('plugins.data-source.top', 'Top'), value: 'desc' },
  { label: t('plugins.data-source.bottom', 'Bottom'), value: 'asc' },
];

export const sizeOptions = () => [
  { label: t('plugins.data-source.no-limit', 'No limit'), value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '5', value: '5' },
  { label: '10', value: '10' },
  { label: '15', value: '15' },
  { label: '20', value: '20' },
];
