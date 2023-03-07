import React from 'react';

import { Input, InlineField, FieldSet } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { ElasticsearchOptions } from '../types';

type Props = {
  value: ElasticsearchOptions;
  onChange: (value: ElasticsearchOptions) => void;
};
export const LogsConfig = (props: Props) => {
  const { value, onChange } = props;
  const changeHandler =
    (key: keyof ElasticsearchOptions) => (event: React.SyntheticEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange({
        ...value,
        [key]: event.currentTarget.value,
      });
    };

  return (
    <FieldSet label={t('app.plugins.data-source.logs', 'Logs')}>
      <InlineField label={t('app.plugins.data-source.message-field-name', 'Message field name')} labelWidth={22}>
        <Input
          id="es_logs-config_logMessageField"
          value={value.logMessageField}
          onChange={changeHandler('logMessageField')}
          placeholder="_source"
          width={24}
        />
      </InlineField>

      <InlineField label={t('app.plugins.data-source.level-field-name', 'Level field name')} labelWidth={22}>
        <Input
          id="es_logs-config_logLevelField"
          value={value.logLevelField}
          onChange={changeHandler('logLevelField')}
          width={24}
        />
      </InlineField>
    </FieldSet>
  );
};
