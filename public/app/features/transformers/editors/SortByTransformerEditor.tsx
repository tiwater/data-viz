import React, { useCallback } from 'react';

import { DataTransformerID, standardTransformers, TransformerRegistryItem, TransformerUIProps } from '@grafana/data';
import { SortByField, SortByTransformerOptions } from '@grafana/data/src/transformations/transformers/sortBy';
import { InlineField, InlineSwitch, InlineFieldRow, Select } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { useAllFieldNamesFromDataFrames } from '../utils';

export const SortByTransformerEditor: React.FC<TransformerUIProps<SortByTransformerOptions>> = ({
  input,
  options,
  onChange,
}) => {
  const fieldNames = useAllFieldNamesFromDataFrames(input).map((item: string) => ({ label: item, value: item }));

  // Only supports single sort for now
  const onSortChange = useCallback(
    (idx: number, cfg: SortByField) => {
      onChange({ ...options, sort: [cfg] });
    },
    [onChange, options]
  );

  const sorts = options.sort?.length ? options.sort : [{} as SortByField];

  return (
    <div>
      {sorts.map((s, index) => {
        return (
          <InlineFieldRow key={`${s.field}/${index}`}>
            <InlineField label={t('features.transformers.sort-by.field', 'Field')} labelWidth={10} grow={true}>
              <Select
                options={fieldNames}
                value={s.field}
                placeholder={t('features.transformers.sort-by.select-field', 'Select field')}
                onChange={(v) => {
                  onSortChange(index, { ...s, field: v.value! });
                }}
              />
            </InlineField>
            <InlineField label={t('features.transformers.sort-by.reverse', 'Reverse')}>
              <InlineSwitch
                value={!!s.desc}
                onChange={() => {
                  onSortChange(index, { ...s, desc: !!!s.desc });
                }}
              />
            </InlineField>
          </InlineFieldRow>
        );
      })}
    </div>
  );
};

export const getSortByTransformRegistryItem = (): TransformerRegistryItem<SortByTransformerOptions> => ({
  id: DataTransformerID.sortBy,
  editor: SortByTransformerEditor,
  transformation: standardTransformers.sortByTransformer,
  name: t('features.transformers.sort-by.name', 'Sort by'),
  description: t('features.transformers.sort-by.description', 'Sort fields in a frame'),
});

export const sortByTransformRegistryItem: TransformerRegistryItem<SortByTransformerOptions> = {
  id: DataTransformerID.sortBy,
  editor: SortByTransformerEditor,
  transformation: standardTransformers.sortByTransformer,
  name: standardTransformers.sortByTransformer.name,
  description: standardTransformers.sortByTransformer.description,
};
