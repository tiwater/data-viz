import { css } from '@emotion/css';
import { cloneDeep } from 'lodash';
import React, { useMemo, useCallback } from 'react';

import {
  DataTransformerID,
  standardTransformers,
  TransformerRegistryItem,
  TransformerUIProps,
  getFieldDisplayName,
  DataFrame,
  SelectableValue,
  FieldType,
  ValueMatcherID,
  valueMatchers,
} from '@grafana/data';
import {
  FilterByValueFilter,
  FilterByValueMatch,
  FilterByValueTransformerOptions,
  FilterByValueType,
} from '@grafana/data/src/transformations/transformers/filterByValue';
import { Button, RadioButtonGroup, stylesFactory } from '@grafana/ui';
import { t, Trans } from 'app/core/internationalization';

import { DataFrameFieldsInfo, FilterByValueFilterEditor } from './FilterByValueFilterEditor';

export const FilterByValueTransformerEditor: React.FC<TransformerUIProps<FilterByValueTransformerOptions>> = (
  props
) => {
  const filterTypes: Array<SelectableValue<FilterByValueType>> = [
    { label: t('features.transformers.filter-by-value.includes', 'Include'), value: FilterByValueType.include },
    { label: t('features.transformers.filter-by-value.exclude', 'Exclude'), value: FilterByValueType.exclude },
  ];

  const filterMatch: Array<SelectableValue<FilterByValueMatch>> = [
    { label: t('features.transformers.filter-by-value.match-all', 'Match all'), value: FilterByValueMatch.all },
    { label: t('features.transformers.filter-by-value.match-any', 'Match any'), value: FilterByValueMatch.any },
  ];
  const { input, options, onChange } = props;
  const styles = getEditorStyles();
  const fieldsInfo = useFieldsInfo(input);

  const onAddFilter = useCallback(() => {
    const frame = input[0];
    const field = frame.fields.find((f) => f.type !== FieldType.time);

    if (!field) {
      return;
    }

    const filters = cloneDeep(options.filters);
    const matcher = valueMatchers.get(ValueMatcherID.greater);

    filters.push({
      fieldName: getFieldDisplayName(field, frame, input),
      config: {
        id: matcher.id,
        options: matcher.getDefaultOptions(field),
      },
    });
    onChange({ ...options, filters });
  }, [onChange, options, input]);

  const onDeleteFilter = useCallback(
    (index: number) => {
      let filters = cloneDeep(options.filters);
      filters.splice(index, 1);
      onChange({ ...options, filters });
    },
    [options, onChange]
  );

  const onChangeFilter = useCallback(
    (filter: FilterByValueFilter, index: number) => {
      let filters = cloneDeep(options.filters);
      filters[index] = filter;
      onChange({ ...options, filters });
    },
    [options, onChange]
  );

  const onChangeType = useCallback(
    (type?: FilterByValueType) => {
      onChange({
        ...options,
        type: type ?? FilterByValueType.include,
      });
    },
    [options, onChange]
  );

  const onChangeMatch = useCallback(
    (match?: FilterByValueMatch) => {
      onChange({
        ...options,
        match: match ?? FilterByValueMatch.all,
      });
    },
    [options, onChange]
  );

  return (
    <div>
      <div className="gf-form gf-form-inline">
        <div className="gf-form-label width-8">
          <Trans i18nKey="features.transformers.filter-by-value.filter-type">Filter type</Trans>
        </div>
        <div className="width-15">
          <RadioButtonGroup options={filterTypes} value={options.type} onChange={onChangeType} fullWidth />
        </div>
      </div>
      <div className="gf-form gf-form-inline">
        <div className="gf-form-label width-8">
          <Trans i18nKey="features.transformers.filter-by-value.conditions">Conditions</Trans>
        </div>
        <div className="width-15">
          <RadioButtonGroup options={filterMatch} value={options.match} onChange={onChangeMatch} fullWidth />
        </div>
      </div>
      <div className={styles.conditions}>
        {options.filters.map((filter, idx) => (
          <FilterByValueFilterEditor
            key={idx}
            filter={filter}
            fieldsInfo={fieldsInfo}
            onChange={(filter) => onChangeFilter(filter, idx)}
            onDelete={() => onDeleteFilter(idx)}
          />
        ))}
        <div className="gf-form">
          <Button icon="plus" size="sm" onClick={onAddFilter} variant="secondary">
            <Trans i18nKey="features.transformers.filter-by-value.add-condition">Add condition</Trans>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const getFilterByValueTransformRegistryItem = (): TransformerRegistryItem<FilterByValueTransformerOptions> => {
  return {
    id: DataTransformerID.filterByValue,
    editor: FilterByValueTransformerEditor,
    transformation: standardTransformers.filterByValueTransformer,
    name: t('features.transformers.filter-by-value.filter-data-by-values', 'Filter data by values'),
    description: t(
      'features.transformers.filter-by-value.removes-rows-of-the-query-results',
      'Removes rows of the query results using user-defined filters. This is useful if you can not filter your data in the data source.'
    ),
  };
};
export const filterByValueTransformRegistryItem: TransformerRegistryItem<FilterByValueTransformerOptions> = {
  id: DataTransformerID.filterByValue,
  editor: FilterByValueTransformerEditor,
  transformation: standardTransformers.filterByValueTransformer,
  name: standardTransformers.filterByValueTransformer.name,
  description:
    'Removes rows of the query results using user-defined filters. This is useful if you can not filter your data in the data source.',
};

const getEditorStyles = stylesFactory(() => ({
  conditions: css`
    padding-left: 16px;
  `,
}));

const useFieldsInfo = (data: DataFrame[]): DataFrameFieldsInfo => {
  return useMemo(() => {
    const meta = {
      fieldsAsOptions: [],
      fieldByDisplayName: {},
    };

    if (!Array.isArray(data)) {
      return meta;
    }

    return data.reduce((meta: DataFrameFieldsInfo, frame) => {
      return frame.fields.reduce((meta, field) => {
        const fieldName = getFieldDisplayName(field, frame, data);

        if (meta.fieldByDisplayName[fieldName]) {
          return meta;
        }

        meta.fieldsAsOptions.push({
          label: fieldName,
          value: fieldName,
          type: field.type,
        });

        meta.fieldByDisplayName[fieldName] = field;

        return meta;
      }, meta);
    }, meta);
  }, [data]);
};
