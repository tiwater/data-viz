import React from 'react';

import { DataTransformerID, standardTransformers, TransformerRegistryItem, TransformerUIProps } from '@grafana/data';
import { MergeTransformerOptions } from '@grafana/data/src/transformations/transformers/merge';
import { FieldValidationMessage } from '@grafana/ui';
import { t, Trans } from 'app/core/internationalization';

export const MergeTransformerEditor: React.FC<TransformerUIProps<MergeTransformerOptions>> = ({
  input,
  options,
  onChange,
}) => {
  if (input.length <= 1) {
    // Show warning that merge is useless only apply on a single frame
    return (
      <FieldValidationMessage>
        <Trans i18nKey="features.transformers.merge.merge-has-no-effect">
          Merge has no effect when applied on a single frame.
        </Trans>
      </FieldValidationMessage>
    );
  }
  return null;
};

export const getMergeTransformerRegistryItem = (): TransformerRegistryItem<MergeTransformerOptions> => ({
  id: DataTransformerID.merge,
  editor: MergeTransformerEditor,
  transformation: standardTransformers.mergeTransformer,
  name: t('features.transformers.merge.name', 'Merge'),
  description: t(
    'features.transformers.merge.description',
    'Merge many series/tables and return a single table where mergeable values will be combined into the same row. Useful for showing multiple series, tables or a combination of both visualized in a table.'
  ),
});

export const mergeTransformerRegistryItem: TransformerRegistryItem<MergeTransformerOptions> = {
  id: DataTransformerID.merge,
  editor: MergeTransformerEditor,
  transformation: standardTransformers.mergeTransformer,
  name: 'Merge',
  description:
    'Merge many series/tables and return a single table where mergeable values will be combined into the same row. Useful for showing multiple series, tables or a combination of both visualized in a table.',
};
