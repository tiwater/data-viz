import React from 'react';

import { SelectableValue, StandardEditorProps } from '@grafana/data';
import { Checkbox, HorizontalGroup, RadioButtonGroup, Tooltip } from '@grafana/ui';
import { t } from 'app/core/internationalization';

export const TickSpacingEditor: React.FC<StandardEditorProps<number>> = (props) => {
  const GAPS_OPTIONS: Array<SelectableValue<number>> = [
    {
      label: t('app.plugins.bar-chart.none', 'None'),
      value: 0,
      description: t('app.plugins.bar-chart.show all tick marks', 'Show all tick marks'),
    },
    {
      label: t('app.plugins.bar-chart.small', 'Small'),
      value: 100,
      description: t('app.plugins.bar-chart.require-100px-spacing', 'Require 100px spacing'),
    },
    {
      label: t('app.plugins.bar-chart.medium', 'Medium'),
      value: 200,
      description: t('app.plugins.bar-chart.require-200px-spacing', 'Require 200px spacing'),
    },
    {
      label: t('app.plugins.bar-chart.large', 'Large'),
      value: 300,
      description: t('app.plugins.bar-chart.require-300px-spacing', 'Require 300px spacing'),
    },
  ];
  let value = props.value ?? 0;
  const isRTL = value < 0;
  if (isRTL) {
    value *= -1;
  }
  let gap = GAPS_OPTIONS[0];
  for (const v of GAPS_OPTIONS) {
    gap = v;
    if (value <= gap.value!) {
      break;
    }
  }

  const onSpacingChange = (val: number) => {
    props.onChange(val * (isRTL ? -1 : 1));
  };

  const onRTLChange = () => {
    props.onChange(props.value * -1);
  };

  return (
    <HorizontalGroup>
      <RadioButtonGroup value={gap.value} options={GAPS_OPTIONS} onChange={onSpacingChange} />
      {value !== 0 && (
        <Tooltip content="Require space from the right side" placement="top">
          <div>
            <Checkbox value={isRTL} onChange={onRTLChange} label="RTL" />
          </div>
        </Tooltip>
      )}
    </HorizontalGroup>
  );
};
