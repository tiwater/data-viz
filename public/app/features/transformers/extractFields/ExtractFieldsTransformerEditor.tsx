import React from 'react';

import {
  DataTransformerID,
  TransformerRegistryItem,
  TransformerUIProps,
  FieldNamePickerConfigSettings,
  SelectableValue,
  StandardEditorsRegistryItem,
} from '@grafana/data';
import { InlineField, InlineFieldRow, Select, InlineSwitch } from '@grafana/ui';
import { FieldNamePicker } from '@grafana/ui/src/components/MatchersUI/FieldNamePicker';
import { t } from 'app/core/internationalization';

import { JSONPathEditor } from './components/JSONPathEditor';
import { extractFieldsTransformer } from './extractFields';
import { fieldExtractors } from './fieldExtractors';
import { ExtractFieldsOptions, FieldExtractorID, JSONPath } from './types';

export const extractFieldsTransformerEditor: React.FC<TransformerUIProps<ExtractFieldsOptions>> = ({
  input,
  options,
  onChange,
}) => {
  const fieldNamePickerSettings: StandardEditorsRegistryItem<string, FieldNamePickerConfigSettings> = {
    settings: {
      width: 30,
      placeholderText: t('features.transformers.extract-fields.select-field', 'Select field'),
    },
    name: '',
    id: '',
    editor: () => null,
  };
  const onPickSourceField = (source?: string) => {
    onChange({
      ...options,
      source,
    });
  };

  const onFormatChange = (format?: SelectableValue<FieldExtractorID>) => {
    onChange({
      ...options,
      format: format?.value,
    });
  };

  const onJSONPathsChange = (jsonPaths: JSONPath[]) => {
    onChange({
      ...options,
      jsonPaths,
    });
  };

  const onToggleReplace = () => {
    if (options.replace) {
      options.keepTime = false;
    }

    onChange({
      ...options,
      replace: !options.replace,
    });
  };

  const onToggleKeepTime = () => {
    onChange({
      ...options,
      keepTime: !options.keepTime,
    });
  };

  const format = fieldExtractors.selectOptions(options.format ? [options.format] : undefined);

  return (
    <div>
      <InlineFieldRow>
        <InlineField label={t('features.transformers.extract-fields.source', 'Source')} labelWidth={16}>
          <FieldNamePicker
            context={{ data: input }}
            value={options.source ?? ''}
            onChange={onPickSourceField}
            item={fieldNamePickerSettings as any}
          />
        </InlineField>
      </InlineFieldRow>
      <InlineFieldRow>
        <InlineField label={t('features.transformers.extract-fields.format', 'Format')} labelWidth={16}>
          <Select
            value={format.current[0] as any}
            options={format.options as any}
            onChange={onFormatChange}
            width={24}
            placeholder={t('features.transformers.extract-fields.auto', 'Auto')}
          />
        </InlineField>
      </InlineFieldRow>
      {options.format === 'json' && <JSONPathEditor options={options.jsonPaths ?? []} onChange={onJSONPathsChange} />}
      <InlineFieldRow>
        <InlineField
          label={t('features.transformers.extract-fields.replace-all-fields', 'Replace all fields')}
          labelWidth={16}
        >
          <InlineSwitch value={options.replace ?? false} onChange={onToggleReplace} />
        </InlineField>
      </InlineFieldRow>
      {options.replace && (
        <InlineFieldRow>
          <InlineField label={'Keep time'} labelWidth={16}>
            <InlineSwitch value={options.keepTime ?? false} onChange={onToggleKeepTime} />
          </InlineField>
        </InlineFieldRow>
      )}
    </div>
  );
};

export const getExtractFieldsTransformRegistryItem = (): TransformerRegistryItem<ExtractFieldsOptions> => ({
  id: DataTransformerID.extractFields,
  editor: extractFieldsTransformerEditor,
  transformation: extractFieldsTransformer,
  name: t('features.transformers.extract-fields.name', 'Extract fields'),
  description: t('features.transformers.extract-fields.description', 'Parse fields from content (JSON, labels, etc)'),
});

export const extractFieldsTransformRegistryItem: TransformerRegistryItem<ExtractFieldsOptions> = {
  id: DataTransformerID.extractFields,
  editor: extractFieldsTransformerEditor,
  transformation: extractFieldsTransformer,
  name: 'Extract fields',
  description: `Parse fields from content (JSON, labels, etc)`,
};
