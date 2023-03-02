import React from 'react';

import { SelectableValue } from '@grafana/data';
import { TableCellBackgroundDisplayMode, TableColoredBackgroundCellOptions } from '@grafana/schema';
import { HorizontalGroup, Select, Field } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { TableCellEditorProps } from '../TableCellOptionEditor';

export const ColorBackgroundCellOptionsEditor = ({
  cellOptions,
  onChange,
}: TableCellEditorProps<TableColoredBackgroundCellOptions>) => {
  const colorBackgroundOpts: SelectableValue[] = [
    { value: TableCellBackgroundDisplayMode.Basic, label: t('plugins.table.basic', 'Basic') },
    { value: TableCellBackgroundDisplayMode.Gradient, label: t('plugins.table.gradient', 'Gradient') },
  ];

  // Set the display mode on change
  const onCellOptionsChange = (v: SelectableValue) => {
    cellOptions.mode = v.value;
    onChange(cellOptions);
  };

  return (
    <HorizontalGroup>
      <Field label={t('plugins.table.background-display-mode', 'Background display mode')}>
        <Select value={cellOptions?.mode} onChange={onCellOptionsChange} options={colorBackgroundOpts} />
      </Field>
    </HorizontalGroup>
  );
};
