import React, { useCallback } from 'react';

import {
  DataTransformerID,
  SelectableValue,
  standardTransformers,
  TransformerRegistryItem,
  TransformerUIProps,
  GroupingToMatrixTransformerOptions,
  SpecialValue,
} from '@grafana/data';
import { InlineField, InlineFieldRow, Select } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { useAllFieldNamesFromDataFrames } from '../utils';

export const GroupingToMatrixTransformerEditor: React.FC<TransformerUIProps<GroupingToMatrixTransformerOptions>> = ({
  input,
  options,
  onChange,
}) => {
  const fieldNames = useAllFieldNamesFromDataFrames(input).map((item: string) => ({ label: item, value: item }));

  const onSelectColumn = useCallback(
    (value: SelectableValue<string>) => {
      onChange({
        ...options,
        columnField: value?.value,
      });
    },
    [onChange, options]
  );

  const onSelectRow = useCallback(
    (value: SelectableValue<string>) => {
      onChange({
        ...options,
        rowField: value?.value,
      });
    },
    [onChange, options]
  );

  const onSelectValue = useCallback(
    (value: SelectableValue<string>) => {
      onChange({
        ...options,
        valueField: value?.value,
      });
    },
    [onChange, options]
  );

  const specialValueOptions: Array<SelectableValue<SpecialValue>> = [
    {
      label: t('features.transformers.grouping-to-matrix.null', 'Null'),
      value: SpecialValue.Null,
      description: t('features.transformers.grouping-to-matrix.null-value', 'Null value'),
    },
    {
      label: t('features.transformers.grouping-to-matrix.true', 'True'),
      value: SpecialValue.True,
      description: t('features.transformers.grouping-to-matrix.boolean-true-value', 'Boolean true value'),
    },
    {
      label: t('features.transformers.grouping-to-matrix.false', 'False'),
      value: SpecialValue.False,
      description: t('features.transformers.grouping-to-matrix.boolean-false-value', 'Boolean false value'),
    },
    {
      label: t('features.transformers.grouping-to-matrix.empty', 'Empty'),
      value: SpecialValue.Empty,
      description: t('features.transformers.grouping-to-matrix.empty string', 'Empty string'),
    },
  ];

  const onSelectEmptyValue = useCallback(
    (value: SelectableValue<SpecialValue>) => {
      onChange({
        ...options,
        emptyValue: value?.value,
      });
    },
    [onChange, options]
  );

  return (
    <>
      <InlineFieldRow>
        <InlineField label={t('features.transformers.grouping-to-matrix.column', 'Column')} labelWidth={8}>
          <Select options={fieldNames} value={options.columnField} onChange={onSelectColumn} isClearable />
        </InlineField>
        <InlineField label={t('features.transformers.grouping-to-matrix.row', 'Row')} labelWidth={8}>
          <Select options={fieldNames} value={options.rowField} onChange={onSelectRow} isClearable />
        </InlineField>
        <InlineField label={t('features.transformers.grouping-to-matrix.cell-value', 'Cell Value')} labelWidth={10}>
          <Select options={fieldNames} value={options.valueField} onChange={onSelectValue} isClearable />
        </InlineField>
        <InlineField label={t('features.transformers.grouping-to-matrix.empty-value', 'Empty Value')}>
          <Select options={specialValueOptions} value={options.emptyValue} onChange={onSelectEmptyValue} isClearable />
        </InlineField>
      </InlineFieldRow>
    </>
  );
};

export const getGroupingToMatrixTransformRegistryItem =
  (): TransformerRegistryItem<GroupingToMatrixTransformerOptions> => ({
    id: DataTransformerID.groupingToMatrix,
    editor: GroupingToMatrixTransformerEditor,
    transformation: standardTransformers.groupingToMatrixTransformer,
    name: t('features.transformers.grouping-to-matrix.name', 'Grouping to matrix'),
    description: t(
      'features.transformers.grouping-to-matrix.description',
      'Takes a three fields combination and produces a Matrix'
    ),
  });

export const groupingToMatrixTransformRegistryItem: TransformerRegistryItem<GroupingToMatrixTransformerOptions> = {
  id: DataTransformerID.groupingToMatrix,
  editor: GroupingToMatrixTransformerEditor,
  transformation: standardTransformers.groupingToMatrixTransformer,
  name: 'Grouping to matrix',
  description: `Takes a three fields combination and produces a Matrix`,
};
