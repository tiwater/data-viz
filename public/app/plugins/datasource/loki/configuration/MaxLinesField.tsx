import React from 'react';

import { LegacyForms } from '@grafana/ui';
import { t, Trans } from 'app/core/internationalization';
const { FormField } = LegacyForms;

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const MaxLinesField = (props: Props) => {
  const { value, onChange } = props;
  return (
    <FormField
      label={t('plugins.data-source.loki.maximum-lines', 'Maximum lines')}
      labelWidth={11}
      inputWidth={20}
      inputEl={
        <input
          type="number"
          className="gf-form-input width-8 gf-form-input--has-help-icon"
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          spellCheck={false}
          placeholder="1000"
        />
      }
      tooltip={
        <Trans i18nKey="plugins.data-source.loki.queries-must-contain-a-limit-of-the-maximum-number">
          Loki queries must contain a limit of the maximum number of lines returned (default: 1000). Increase this limit
          to have a bigger result set for ad-hoc analysis. Decrease this limit if your browser becomes sluggish when
          displaying the log results.
        </Trans>
      }
    />
  );
};
