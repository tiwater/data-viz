import React from 'react';

import { DataTransformerID, standardTransformers, TransformerRegistryItem, TransformerUIProps } from '@grafana/data';
import { SeriesToRowsTransformerOptions } from '@grafana/data/src/transformations/transformers/seriesToRows';
import { t } from 'app/core/internationalization';

export const SeriesToRowsTransformerEditor: React.FC<TransformerUIProps<SeriesToRowsTransformerOptions>> = ({
  input,
  options,
  onChange,
}) => {
  return null;
};

export const getSeriesToRowsTransformerRegistryItem = (): TransformerRegistryItem<SeriesToRowsTransformerOptions> => ({
  id: DataTransformerID.seriesToRows,
  editor: SeriesToRowsTransformerEditor,
  transformation: standardTransformers.seriesToRowsTransformer,
  name: t('features.transformers.series-to-rows.name', 'Series to rows'),
  description: t(
    'features.transformers.series-to-rows.description',
    'Merge many series and return a single series with time, metric and value as columns. Useful for showing multiple time series visualized in a table.'
  ),
});

export const seriesToRowsTransformerRegistryItem: TransformerRegistryItem<SeriesToRowsTransformerOptions> = {
  id: DataTransformerID.seriesToRows,
  editor: SeriesToRowsTransformerEditor,
  transformation: standardTransformers.seriesToRowsTransformer,
  name: 'Series to rows',
  description:
    'Merge many series and return a single series with time, metric and value as columns. Useful for showing multiple time series visualized in a table.',
};
