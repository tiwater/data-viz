import React, { useMemo } from 'react';

import { PluginState, SelectableValue, TransformerRegistryItem, TransformerUIProps } from '@grafana/data';
import { Alert, HorizontalGroup, InlineField, InlineFieldRow, Select, ValuePicker } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { getDistinctLabels } from '../utils';

import { joinByLabelsTransformer, JoinByLabelsTransformOptions } from './joinByLabels';

export interface Props extends TransformerUIProps<JoinByLabelsTransformOptions> {}

export function JoinByLabelsTransformerEditor({ input, options, onChange }: Props) {
  const info = useMemo(() => {
    let warn: React.ReactNode = undefined;
    const distinct = getDistinctLabels(input);
    const valueOptions = Array.from(distinct).map((value) => ({ label: value, value }));
    let valueOption = valueOptions.find((v) => v.value === options.value);
    if (!valueOption && options.value) {
      valueOption = { label: `${options.value} (not found)`, value: options.value };
      valueOptions.push(valueOption);
    }

    if (!input.length) {
      warn = (
        <Alert title={t('features.transformers.join-by-labels.no-input-found', 'No input found')}>
          {t('features.transformers.join-by-labels.no-input-found', 'No input found')}
        </Alert>
      );
    } else if (distinct.size === 0) {
      warn = (
        <Alert title={t('features.transformers.join-by-labels.no-labels-found', 'No labels found')}>
          {t(
            'features.transformers.join-by-labels.the-input-does-not-contain',
            'The input does not contain any labels'
          )}
        </Alert>
      );
    }

    // Show the selected values
    distinct.delete(options.value);
    const joinOptions = Array.from(distinct).map((value) => ({ label: value, value }));

    let addOptions = joinOptions;
    const hasJoin = Boolean(options.join?.length);
    let addText = 'Join';
    if (hasJoin) {
      addOptions = joinOptions.filter((v) => !options.join!.includes(v.value));
    } else {
      addText = joinOptions.map((v) => v.value).join(', '); // all the fields
    }

    return { warn, valueOptions, valueOption, joinOptions, addOptions, addText, hasJoin, key: Date.now() };
  }, [options, input]);

  const updateJoinValue = (idx: number, value?: string) => {
    if (!options.join) {
      return; // nothing to do
    }

    const join = options.join.slice();
    if (!value) {
      join.splice(idx, 1);
      if (!join.length) {
        onChange({ ...options, join: undefined });
        return;
      }
    } else {
      join[idx] = value;
    }

    // Remove duplicates and the value field
    const t = new Set(join);
    if (options.value) {
      t.delete(options.value);
    }
    onChange({ ...options, join: Array.from(t) });
  };

  const addJoin = (sel: SelectableValue<string>) => {
    const v = sel?.value;
    if (!v) {
      return;
    }
    const join = options.join ? options.join.slice() : [];
    join.push(v);
    onChange({ ...options, join });
  };

  const labelWidth = 10;
  const noOptionsMessage = t('features.transformers.join-by-labels.no-labels-found', 'No labels found');

  return (
    <div>
      {info.warn}

      <InlineFieldRow>
        <InlineField
          error="required"
          invalid={!Boolean(options.value?.length)}
          label={t('features.transformers.join-by-labels.value', 'Value')}
          labelWidth={labelWidth}
          tooltip="Select the label indicating the values name"
        >
          <Select
            options={info.valueOptions}
            value={info.valueOption}
            onChange={(v) => onChange({ ...options, value: v.value! })}
            noOptionsMessage={noOptionsMessage}
          />
        </InlineField>
      </InlineFieldRow>
      {info.hasJoin ? (
        options.join!.map((v, idx) => (
          <InlineFieldRow key={v + idx}>
            <InlineField
              label={t('features.transformers.join-by-labels.join', 'Join')}
              labelWidth={labelWidth}
              error={t('features.transformers.join-by-labels.unable-to-join', 'Unable to join by the value label')}
              invalid={v === options.value}
            >
              <HorizontalGroup>
                <Select
                  options={info.joinOptions}
                  value={info.joinOptions.find((o) => o.value === v)}
                  isClearable={true}
                  onChange={(v) => updateJoinValue(idx, v?.value)}
                  noOptionsMessage={noOptionsMessage}
                />
                {Boolean(info.addOptions.length && idx === options.join!.length - 1) && (
                  <ValuePicker
                    icon="plus"
                    label={''}
                    options={info.addOptions}
                    onChange={addJoin}
                    variant="secondary"
                  />
                )}
              </HorizontalGroup>
            </InlineField>
          </InlineFieldRow>
        ))
      ) : (
        <>
          {Boolean(info.addOptions.length) && (
            <InlineFieldRow>
              <InlineField label={t('features.transformers.join-by-labels.join', 'Join')} labelWidth={labelWidth}>
                <Select
                  options={info.addOptions}
                  placeholder={info.addText}
                  onChange={addJoin}
                  noOptionsMessage={noOptionsMessage}
                />
              </InlineField>
            </InlineFieldRow>
          )}
        </>
      )}
    </div>
  );
}

export const getJoinByLabelsTransformRegistryItem = (): TransformerRegistryItem<JoinByLabelsTransformOptions> => ({
  id: joinByLabelsTransformer.id,
  editor: JoinByLabelsTransformerEditor,
  transformation: joinByLabelsTransformer,
  name: t('features.transformers.join-by-labels.name', 'Join by labels'),
  description: t(
    'features.transformers.join-by-labels.description',
    'Flatten labeled results into a table joined by labels'
  ),
  state: PluginState.beta,
  //   help: `
  // ### Use cases

  // This transforms labeled results into a table
  // `,
});

export const joinByLabelsTransformRegistryItem: TransformerRegistryItem<JoinByLabelsTransformOptions> = {
  id: joinByLabelsTransformer.id,
  editor: JoinByLabelsTransformerEditor,
  transformation: joinByLabelsTransformer,
  name: joinByLabelsTransformer.name,
  description: joinByLabelsTransformer.description,
  state: PluginState.beta,
  //   help: `
  // ### Use cases

  // This transforms labeled results into a table
  // `,
};
