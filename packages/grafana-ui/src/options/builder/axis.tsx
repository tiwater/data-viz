import React from 'react';

import {
  FieldConfigEditorBuilder,
  FieldType,
  identityOverrideProcessor,
  SelectableValue,
  StandardEditorProps,
} from '@grafana/data';
import { AxisColorMode, AxisConfig, AxisPlacement, ScaleDistribution, ScaleDistributionConfig } from '@grafana/schema';

import { graphFieldOptions, Select, RadioButtonGroup, Input, Field } from '../../index';

import { t } from '../../../src/utils/i18n';

/**
 * @alpha
 */
export function addAxisConfig(
  builder: FieldConfigEditorBuilder<AxisConfig>,
  defaultConfig: AxisConfig,
  hideScale?: boolean
) {
  const category = [t('grafana-ui.options.axis', 'Axis')];

  // options for axis appearance
  builder
    .addRadio({
      path: 'axisPlacement',
      name: t('grafana-ui.options.placement', 'Placement'),
      category,
      defaultValue: graphFieldOptions().axisPlacement[0].value,
      settings: {
        options: graphFieldOptions().axisPlacement,
      },
    })
    .addTextInput({
      path: 'axisLabel',
      name: t('grafana-ui.options.label', 'Label'),
      category,
      defaultValue: '',
      settings: {
        placeholder: t('grafana-ui.options.optional-text', 'Optional text'),
      },
      showIf: (c) => c.axisPlacement !== AxisPlacement.Hidden,
      // Do not apply default settings to time and string fields which are used as x-axis fields in Time series and Bar chart panels
      shouldApply: (f) => f.type !== FieldType.time && f.type !== FieldType.string,
    })
    .addNumberInput({
      path: 'axisWidth',
      name: t('grafana-ui.options.width', 'Width'),
      category,
      settings: {
        placeholder: t('grafana-ui.options.auto', 'Auto'),
      },
      showIf: (c) => c.axisPlacement !== AxisPlacement.Hidden,
    })
    .addRadio({
      path: 'axisGridShow',
      name: t('grafana-ui.options.show-grid-lines', 'Show grid lines'),
      category,
      defaultValue: undefined,
      settings: {
        options: [
          { value: undefined, label: t('grafana-ui.options.auto', 'Auto') },
          { value: true, label: t('grafana-ui.options.on', 'On') },
          { value: false, label: t('grafana-ui.options.off', 'Off') },
        ],
      },
    })
    .addRadio({
      path: 'axisColorMode',
      name: t('grafana-ui.options.color', 'Color'),
      category,
      defaultValue: AxisColorMode.Text,
      settings: {
        options: [
          { value: AxisColorMode.Text, label: t('grafana-ui.options.text', 'Text') },
          { value: AxisColorMode.Series, label: t('grafana-ui.options.series', 'Series') },
        ],
      },
    });

  // options for scale range
  builder
    .addCustomEditor<void, ScaleDistributionConfig>({
      id: 'scaleDistribution',
      path: 'scaleDistribution',
      name: t('grafana-ui.options.scale', 'Scale'),
      category,
      editor: ScaleDistributionEditor as any,
      override: ScaleDistributionEditor as any,
      defaultValue: { type: ScaleDistribution.Linear },
      shouldApply: (f) => f.type === FieldType.number,
      process: identityOverrideProcessor,
    })
    .addBooleanSwitch({
      path: 'axisCenteredZero',
      name: t('grafana-ui.options.centered-zero', 'Centered zero'),
      category,
      defaultValue: false,
      showIf: (c) => c.scaleDistribution?.type !== ScaleDistribution.Log,
    })
    .addNumberInput({
      path: 'axisSoftMin',
      name: t('grafana-ui.options.soft-min', 'Soft min'),
      defaultValue: defaultConfig.axisSoftMin,
      category,
      settings: {
        placeholder: t('grafana-ui.options.axis-soft-min-placeholder', 'See: Standard options > Min'),
      },
    })
    .addNumberInput({
      path: 'axisSoftMax',
      name: t('grafana-ui.options.soft-max', 'Soft max'),
      defaultValue: defaultConfig.axisSoftMax,
      category,
      settings: {
        placeholder: t('grafana-ui.options.axis-soft-max-placeholder', 'See: Standard options > Max'),
      },
    });
}



const LOG_DISTRIBUTION_OPTIONS: Array<SelectableValue<number>> = [
  {
    label: '2',
    value: 2,
  },
  {
    label: '10',
    value: 10,
  },
];

/**
 * @internal
 */
export const ScaleDistributionEditor = ({ value, onChange }: StandardEditorProps<ScaleDistributionConfig>) => {
  
  const DISTRIBUTION_OPTIONS: Array<SelectableValue<ScaleDistribution>> = [
    {
      label: t('grafana-ui.options.linear', 'Linear'),
      value: ScaleDistribution.Linear,
    },
    {
      label: t('grafana-ui.options.logarithmic', 'Logarithmic'),
      value: ScaleDistribution.Log,
    },
    {
      label: t('grafana-ui.options.symlog', 'Symlog'),
      value: ScaleDistribution.Symlog,
    },
  ];

  const type = value?.type ?? ScaleDistribution.Linear;


  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <RadioButtonGroup
          value={type}
          options={DISTRIBUTION_OPTIONS}
          onChange={(v) => {
            onChange({
              ...value,
              type: v!,
              log: v === ScaleDistribution.Linear ? undefined : value.log ?? 2,
            });
          }}
        />
      </div>
      {(type === ScaleDistribution.Log || type === ScaleDistribution.Symlog) && (
        <Field label="Log base">
          <Select
            options={LOG_DISTRIBUTION_OPTIONS}
            value={value.log ?? 2}
            onChange={(v) => {
              onChange({
                ...value,
                log: v.value!,
              });
            }}
          />
        </Field>
      )}
      {type === ScaleDistribution.Symlog && (
        <Field label="Linear threshold">
          <Input
            placeholder="1"
            value={value.linearThreshold}
            onChange={(v) => {
              onChange({
                ...value,
                linearThreshold: Number(v.currentTarget.value),
              });
            }}
          />
        </Field>
      )}
    </>
  );
};
