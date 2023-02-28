import React, { PropsWithChildren, useMemo } from 'react';

import { VariableRefresh } from '@grafana/data';
import { Field, RadioButtonGroup } from '@grafana/ui';
import { t } from 'app/core/internationalization';

interface Props {
  onChange: (option: VariableRefresh) => void;
  refresh: VariableRefresh;
}

const getREFRESH_OPTIONS = () => [
  {
    label: t('features.variables.query.on-dashboard-load', 'On dashboard load'),
    value: VariableRefresh.onDashboardLoad,
  },
  {
    label: t('features.variables.query.on-time-range-change', 'On time range change'),
    value: VariableRefresh.onTimeRangeChanged,
  },
];

export function QueryVariableRefreshSelect({ onChange, refresh }: PropsWithChildren<Props>) {
  // const REFRESH_OPTIONS = [
  //   { label: t("features.variables.query.on-dashboard-load",'On dashboard load'), value: VariableRefresh.onDashboardLoad },
  //   { label: t("features.variables.query.on-time-range-change",'On time range change'), value: VariableRefresh.onTimeRangeChanged },
  // ];
  const value = useMemo(
    () => getREFRESH_OPTIONS().find((o) => o.value === refresh)?.value ?? getREFRESH_OPTIONS()[0].value,
    [refresh]
  );

  return (
    <Field
      label={t('features.variables.query.refresh', 'Refresh')}
      description={t(
        'features.variables.query.when to update the values',
        'When to update the values of this variable'
      )}
    >
      <RadioButtonGroup options={getREFRESH_OPTIONS()} onChange={onChange} value={value} />
    </Field>
  );
}
