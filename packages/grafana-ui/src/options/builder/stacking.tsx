import React from 'react';

import {
  FieldConfigEditorBuilder,
  FieldOverrideEditorProps,
  FieldType,
  identityOverrideProcessor,
} from '@grafana/data';
import { StackingConfig, StackingMode } from '@grafana/schema';

import { t } from '../../../src/utils/i18n';

import {
  GraphFieldConfig,
  graphFieldOptions,
  HorizontalGroup,
  IconButton,
  Input,
  RadioButtonGroup,
  Tooltip,
} from '../..';

export const StackingEditor: React.FC<FieldOverrideEditorProps<StackingConfig, any>> = ({
  value,
  context,
  onChange,
  item,
}) => {
  return (
    <HorizontalGroup>
      <RadioButtonGroup
        value={value?.mode || StackingMode.None}
        options={item.settings.options}
        onChange={(v) => {
          onChange({
            ...value,
            mode: v,
          });
        }}
      />
      {context.isOverride && value?.mode && value?.mode !== StackingMode.None && (
        <Input
          type="text"
          placeholder={t('grafana-ui.options.group', 'Group')}
          suffix={
            <Tooltip content="Name of the stacking group" placement="top">
              <IconButton name="question-circle" />
            </Tooltip>
          }
          defaultValue={value?.group}
          onChange={(v) => {
            onChange({
              ...value,
              group: v.currentTarget.value.trim(),
            });
          }}
        />
      )}
    </HorizontalGroup>
  );
};

export function addStackingConfig(
  builder: FieldConfigEditorBuilder<GraphFieldConfig>,
  defaultConfig?: StackingConfig,
  category = [t('grafana-ui.options.graph-styles', 'Graph styles')]
) {
  builder.addCustomEditor({
    id: 'stacking',
    path: 'stacking',
    name: t('grafana-ui.options.stack-series', 'Stack series'),
    category: category,
    defaultValue: defaultConfig,
    editor: StackingEditor,
    override: StackingEditor,
    settings: {
      options: graphFieldOptions().stacking,
    },
    process: identityOverrideProcessor,
    shouldApply: (f) => f.type === FieldType.number,
  });
}
