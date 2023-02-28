import React, { useCallback } from 'react';

import { SelectableValue } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { t } from '../../../src/utils/i18n';
import { Select } from '../Select/Select';

export interface Props {
  onChange: (weekStart: string) => void;
  value: string;
  width?: number;
  autoFocus?: boolean;
  onBlur?: () => void;
  disabled?: boolean;
  inputId?: string;
}

export const WeekStartPicker = (props: Props) => {
  const weekStarts: Array<SelectableValue<string>> = [
    { value: '', label: t('grafana-ui.date-time.default', 'Default') },
    { value: 'saturday', label: t('grafana-ui.date-time.saturday', 'Saturday') },
    { value: 'sunday', label: t('grafana-ui.date-time.sunday', 'Sunday') },
    { value: 'monday', label: t('grafana-ui.date-time.monday', 'Monday') },
  ];
  const { onChange, width, autoFocus = false, onBlur, value, disabled = false, inputId } = props;

  const onChangeWeekStart = useCallback(
    (selectable: SelectableValue<string>) => {
      if (selectable.value !== undefined) {
        onChange(selectable.value);
      }
    },
    [onChange]
  );

  return (
    <Select
      inputId={inputId}
      value={weekStarts.find((item) => item.value === value)?.value}
      placeholder={selectors.components.WeekStartPicker.placeholder}
      autoFocus={autoFocus}
      openMenuOnFocus={true}
      width={width}
      options={weekStarts}
      onChange={onChangeWeekStart}
      onBlur={onBlur}
      disabled={disabled}
    />
  );
};
