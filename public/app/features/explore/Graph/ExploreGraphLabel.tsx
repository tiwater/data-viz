import React from 'react';

import { SelectableValue } from '@grafana/data';
import { RadioButtonGroup, HorizontalGroup } from '@grafana/ui';
import { t, Trans } from 'app/core/internationalization';
import { EXPLORE_GRAPH_STYLES, ExploreGraphStyle } from 'app/types';

type Props = {
  graphStyle: ExploreGraphStyle;
  onChangeGraphStyle: (style: ExploreGraphStyle) => void;
};
// const ALL_GRAPH_STYLE_OPTIONS: Array<SelectableValue<ExploreGraphStyle>> = EXPLORE_GRAPH_STYLES.map((style,index) => ({
//   value: style,
//   // capital-case it and switch `_` to ` `
//   label: style[0].toUpperCase() + style.slice(1).replace(/_/, ' '),
// }));

export function ExploreGraphLabel(props: Props) {
  const ALL_GRAPH_STYLE_OPTIONS = [
    {
      value: 'lines',
      label: t('features.explore.lines', 'Lines'),
    },
    {
      value: 'bars',
      label: t('features.explore.bars', 'Bars'),
    },
    {
      value: 'points',
      label: t('features.explore.points', 'Points'),
    },
    {
      value: 'stacked_lines',
      label: t('features.explore.stacked-lines', 'Stacked lines'),
    },
    {
      value: 'stacked_bars',
      label: t('features.explore.stacked-bars', 'Stacked bars'),
    },
  ];

  const { graphStyle, onChangeGraphStyle } = props;
  return (
    <HorizontalGroup justify="space-between" wrap>
      <Trans i18nKey="features.explore.graph">Graph</Trans>
      <RadioButtonGroup size="sm" options={ALL_GRAPH_STYLE_OPTIONS} value={graphStyle} onChange={onChangeGraphStyle} />
    </HorizontalGroup>
  );
}
