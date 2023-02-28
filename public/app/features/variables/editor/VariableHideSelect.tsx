import React, { PropsWithChildren, useMemo } from 'react';

import { VariableType, VariableHide } from '@grafana/data';
import { Field, RadioButtonGroup } from '@grafana/ui';
import { t } from 'app/core/internationalization';

interface Props {
  onChange: (option: VariableHide) => void;
  hide: VariableHide;
  type: VariableType;
}

const getHIDE_OPTIONS = () => [
  { label: t('features.variables.editor.label-and-value', 'Label and value'), value: VariableHide.dontHide },
  { label: t('features.variables.editor.value', 'Value'), value: VariableHide.hideLabel },
  { label: t('features.variables.editor.nothing', 'Nothing'), value: VariableHide.hideVariable },
];

export function VariableHideSelect({ onChange, hide, type }: PropsWithChildren<Props>) {
  // const HIDE_OPTIONS = [
  //   { label: t('features.variables.editor.label-and-value','Label and value'), value: VariableHide.dontHide },
  //   { label: t('features.variables.editor.value','Value'), value: VariableHide.hideLabel },
  //   { label:  t('features.variables.editor.nothing','Nothing'), value: VariableHide.hideVariable },
  // ];
  const value = useMemo(
    () => getHIDE_OPTIONS().find((o) => o.value === hide)?.value ?? getHIDE_OPTIONS()[0].value,
    [hide]
  );

  if (type === 'constant') {
    return null;
  }

  return (
    <Field label={t('features.variables.editor.show-on-dashboard', 'Show on dashboard')}>
      <RadioButtonGroup options={getHIDE_OPTIONS()} onChange={onChange} value={value} />
    </Field>
  );
}
