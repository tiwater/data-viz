import React, { useCallback } from 'react';

import {
  DataTransformerID,
  ReducerID,
  SelectableValue,
  standardTransformers,
  TransformerRegistryItem,
  TransformerUIProps,
} from '@grafana/data';
import { ReduceTransformerMode, ReduceTransformerOptions } from '@grafana/data/src/transformations/transformers/reduce';
import { selectors } from '@grafana/e2e-selectors';
import { LegacyForms, Select, StatsPicker } from '@grafana/ui';
import { t, Trans } from 'app/core/internationalization';

// TODO:  Minimal implementation, needs some <3
export const ReduceTransformerEditor: React.FC<TransformerUIProps<ReduceTransformerOptions>> = ({
  options,
  onChange,
}) => {
  const modes: Array<SelectableValue<ReduceTransformerMode>> = [
    {
      label: t('features.transformers.reduce.series-to-rows', 'Series to rows'),
      value: ReduceTransformerMode.SeriesToRows,
      description: t(
        'features.transformers.reduce.create-a-table-with-one-row',
        'Create a table with one row for each series value'
      ),
    },
    {
      label: t('features.transformers.reduce.reduce-fields', 'Reduce fields'),
      value: ReduceTransformerMode.ReduceFields,
      description: t(
        'features.transformers.reduce.collapse-each-field-into',
        'Collapse each field into a single value'
      ),
    },
  ];

  const onSelectMode = useCallback(
    (value: SelectableValue<ReduceTransformerMode>) => {
      const mode = value.value!;
      onChange({
        ...options,
        mode,
        includeTimeField: mode === ReduceTransformerMode.ReduceFields ? !!options.includeTimeField : false,
      });
    },
    [onChange, options]
  );

  const onToggleTime = useCallback(() => {
    onChange({
      ...options,
      includeTimeField: !options.includeTimeField,
    });
  }, [onChange, options]);

  const onToggleLabels = useCallback(() => {
    onChange({
      ...options,
      labelsToFields: !options.labelsToFields,
    });
  }, [onChange, options]);

  return (
    <>
      <div>
        <div className="gf-form gf-form--grow">
          <div className="gf-form-label width-8" aria-label={selectors.components.Transforms.Reduce.modeLabel}>
            <Trans i18nKey="features.transformers.reduce.mode">Mode</Trans>
          </div>
          <Select
            options={modes}
            value={modes.find((v) => v.value === options.mode) || modes[0]}
            onChange={onSelectMode}
            className="flex-grow-1"
          />
        </div>
      </div>
      <div className="gf-form-inline">
        <div className="gf-form gf-form--grow">
          <div className="gf-form-label width-8" aria-label={selectors.components.Transforms.Reduce.calculationsLabel}>
            <Trans i18nKey="features.transformers.reduce.calculations">Calculations</Trans>
          </div>
          <StatsPicker
            className="flex-grow-1"
            placeholder={t('features.transformers.reduce.choose-stat', 'Choose Stat')}
            allowMultiple
            stats={options.reducers || []}
            onChange={(stats) => {
              onChange({
                ...options,
                reducers: stats as ReducerID[],
              });
            }}
          />
        </div>
      </div>
      {options.mode === ReduceTransformerMode.ReduceFields && (
        <div className="gf-form-inline">
          <div className="gf-form">
            <LegacyForms.Switch
              label={t('features.transformers.reduce.include-time', 'Include time')}
              labelClass="width-8"
              checked={!!options.includeTimeField}
              onChange={onToggleTime}
            />
          </div>
        </div>
      )}
      {options.mode !== ReduceTransformerMode.ReduceFields && (
        <div className="gf-form-inline">
          <div className="gf-form">
            <LegacyForms.Switch
              label={t('features.transformers.reduce.labels-to-fields', 'Labels to fields')}
              labelClass="width-8"
              checked={!!options.labelsToFields}
              onChange={onToggleLabels}
            />
          </div>
        </div>
      )}
    </>
  );
};
export const getReduceTransformRegistryItem = (): TransformerRegistryItem<ReduceTransformerOptions> => ({
  id: DataTransformerID.reduce,
  editor: ReduceTransformerEditor,
  transformation: standardTransformers.reduceTransformer,
  name: t('features.transformers.reduce.name', 'Reduce'),
  description: t(
    'features.transformers.reduce.reduce-all-rows-or-data-points',
    'Reduce all rows or data points to a single value using a function like max, min, mean or last'
  ),
});

export const reduceTransformRegistryItem: TransformerRegistryItem<ReduceTransformerOptions> = {
  id: DataTransformerID.reduce,
  editor: ReduceTransformerEditor,
  transformation: standardTransformers.reduceTransformer,
  name: standardTransformers.reduceTransformer.name,
  description: standardTransformers.reduceTransformer.description,
};
