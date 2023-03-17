import { FieldColorModeId, FieldConfigProperty, PanelPlugin } from '@grafana/data';
import { commonOptionsBuilder } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { addStandardDataReduceOptions } from '../stat/common';

import { PieChartPanel } from './PieChartPanel';
import { PieChartPanelChangedHandler } from './migrations';
import { PanelOptions, PanelFieldConfig, PieChartType, PieChartLabels, PieChartLegendValues } from './panelcfg.gen';
import { PieChartSuggestionsSupplier } from './suggestions';

export const plugin = new PanelPlugin<PanelOptions, PanelFieldConfig>(PieChartPanel)
  .setPanelChangeHandler(PieChartPanelChangedHandler)
  .useFieldConfig({
    disableStandardOptions: [FieldConfigProperty.Thresholds],
    standardOptions: {
      [FieldConfigProperty.Color]: {
        settings: {
          byValueSupport: false,
          bySeriesSupport: true,
          preferThresholdsMode: false,
        },
        defaultValue: {
          mode: FieldColorModeId.PaletteClassic,
        },
      },
    },
    useCustomConfig: (builder) => {
      commonOptionsBuilder.addHideFrom(builder);
    },
  })
  .setPanelOptions((builder) => {
    addStandardDataReduceOptions(builder);
    builder
      .addRadio({
        name: t('plugins.pie-chart.pie-chart-type', 'Piechart type'),
        description: t('plugins.pie-chart.how-the-piechart-should-be-rendered', 'How the piechart should be rendered'),
        path: 'pieType',
        settings: {
          options: [
            { value: PieChartType.Pie, label: t('plugins.pie-chart.pie', 'Pie') },
            { value: PieChartType.Donut, label: t('plugins.pie-chart.donut', 'Donut') },
          ],
        },
        defaultValue: PieChartType.Pie,
      })
      .addMultiSelect({
        name: t('plugins.pie-chart.labels', 'Labels'),
        path: 'displayLabels',
        description: t(
          'plugins.pie-chart.select-the-labels-to-be-displayed',
          'Select the labels to be displayed in the pie chart'
        ),
        settings: {
          options: [
            { value: PieChartLabels.Percent, label: t('plugins.pie-chart.percent', 'Percent') },
            { value: PieChartLabels.Name, label: t('plugins.pie-chart.name', 'Name') },
            { value: PieChartLabels.Value, label: t('plugins.pie-chart.value', 'Value') },
          ],
        },
      });

    commonOptionsBuilder.addTooltipOptions(builder);
    commonOptionsBuilder.addLegendOptions(builder, false);

    builder.addMultiSelect({
      name: t('plugins.pie-chart.legend-values', 'Legend values'),
      path: 'legend.values',
      category: [t('plugins.pie-chart.legend', 'Legend')],
      settings: {
        options: [
          { value: PieChartLegendValues.Percent, label: t('plugins.pie-chart.percent', 'Percent') },
          { value: PieChartLegendValues.Value, label: t('plugins.pie-chart.value', 'Value') },
        ],
      },
      showIf: (c) => c.legend.showLegend !== false,
    });
  })
  .setSuggestionsSupplier(new PieChartSuggestionsSupplier());
