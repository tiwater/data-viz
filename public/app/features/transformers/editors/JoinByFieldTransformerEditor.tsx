import React, { useCallback } from 'react';

import {
  DataTransformerID,
  SelectableValue,
  standardTransformers,
  TransformerRegistryItem,
  TransformerUIProps,
} from '@grafana/data';
import { JoinByFieldOptions, JoinMode } from '@grafana/data/src/transformations/transformers/joinByField';
import { Select, InlineFieldRow, InlineField } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { useAllFieldNamesFromDataFrames } from '../utils';

export function SeriesToFieldsTransformerEditor({ input, options, onChange }: TransformerUIProps<JoinByFieldOptions>) {
  const fieldNames = useAllFieldNamesFromDataFrames(input).map((item: string) => ({ label: item, value: item }));
  const modes = [
    {
      value: JoinMode.outer,
      label: t('features.transformers.join-by-field.outer', 'OUTER'),
      description: t(
        'features.transformers.join-by-field.keep-all-rows-from',
        'Keep all rows from any table with a value'
      ),
    },
    {
      value: JoinMode.inner,
      label: t('features.transformers.join-by-field.inner', 'INNER'),
      description: t(
        'features.transformers.join-by-field.drop-rows-that-do',
        'Drop rows that do not match a value in all tables'
      ),
    },
  ];
  const onSelectField = useCallback(
    (value: SelectableValue<string>) => {
      onChange({
        ...options,
        byField: value?.value,
      });
    },
    [onChange, options]
  );

  const onSetMode = useCallback(
    (value: SelectableValue<JoinMode>) => {
      onChange({
        ...options,
        mode: value?.value,
      });
    },
    [onChange, options]
  );

  return (
    <>
      <InlineFieldRow>
        <InlineField label={t('features.transformers.join-by-field.mode', 'Mode')} labelWidth={8} grow>
          <Select options={modes} value={options.mode ?? JoinMode.outer} onChange={onSetMode} />
        </InlineField>
      </InlineFieldRow>
      <InlineFieldRow>
        <InlineField label={t('features.transformers.join-by-field.field', 'Field')} labelWidth={8} grow>
          <Select
            options={fieldNames}
            value={options.byField}
            onChange={onSelectField}
            placeholder={t('features.transformers.join-by-field.time', 'time')}
            isClearable
          />
        </InlineField>
      </InlineFieldRow>
    </>
  );
}

export const getJoinByFieldTransformerRegistryItem = (): TransformerRegistryItem<JoinByFieldOptions> => ({
  id: DataTransformerID.joinByField,
  aliasIds: [DataTransformerID.seriesToColumns],
  editor: SeriesToFieldsTransformerEditor,
  transformation: standardTransformers.joinByFieldTransformer,
  name: t('features.transformers.join-by-field.name', 'Join by field'),
  description: t(
    'features.transformers.join-by-field.description',
    'Combine rows from two or more tables, based on a related field between them.  This can be used to outer join multiple time series on the _time_ field to show many time series in one table.'
  ),
});

export const joinByFieldTransformerRegistryItem: TransformerRegistryItem<JoinByFieldOptions> = {
  id: DataTransformerID.joinByField,
  aliasIds: [DataTransformerID.seriesToColumns],
  editor: SeriesToFieldsTransformerEditor,
  transformation: standardTransformers.joinByFieldTransformer,
  name: standardTransformers.joinByFieldTransformer.name,
  description: standardTransformers.joinByFieldTransformer.description,
};
