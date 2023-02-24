import React, { FormEvent, useCallback } from 'react';

import { DataTransformerID, standardTransformers, TransformerRegistryItem, TransformerUIProps } from '@grafana/data';
import { LimitTransformerOptions } from '@grafana/data/src/transformations/transformers/limit';
import { InlineField, InlineFieldRow, Input } from '@grafana/ui';
import { t } from 'app/core/internationalization';

export const LimitTransformerEditor: React.FC<TransformerUIProps<LimitTransformerOptions>> = ({
  options,
  onChange,
}) => {
  const onSetLimit = useCallback(
    (value: FormEvent<HTMLInputElement>) => {
      onChange({
        ...options,
        limitField: Number(value.currentTarget.value),
      });
    },
    [onChange, options]
  );

  return (
    <>
      <InlineFieldRow>
        <InlineField label={t('features.transformers.limit.name', 'Limit')} labelWidth={8}>
          <Input
            placeholder={t('features.transformers.limit.limit-count', 'Limit count')}
            pattern="[0-9]*"
            value={options.limitField}
            onChange={onSetLimit}
            width={25}
          />
        </InlineField>
      </InlineFieldRow>
    </>
  );
};

export const getLimitTransformRegistryItem = (): TransformerRegistryItem<LimitTransformerOptions> => ({
  id: DataTransformerID.limit,
  editor: LimitTransformerEditor,
  transformation: standardTransformers.limitTransformer,
  name: t('features.transformers.limit.name', 'Limit'),
  description: t('features.transformers.limit.description', 'Limit the number of items displayed.'),
});

export const limitTransformRegistryItem: TransformerRegistryItem<LimitTransformerOptions> = {
  id: DataTransformerID.limit,
  editor: LimitTransformerEditor,
  transformation: standardTransformers.limitTransformer,
  name: t('features.transformers.limit.name', 'Limit'),
  description: t('features.transformers.limit.description', 'Limit the number of items displayed.'),
};
