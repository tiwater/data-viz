import { PanelPlugin } from '@grafana/data';
import { commonOptionsBuilder } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { addOrientationOption, addStandardDataReduceOptions } from '../stat/common';

import { gaugePanelMigrationHandler, gaugePanelChangedHandler } from './GaugeMigrations';
import { GaugePanel } from './GaugePanel';
import { PanelOptions, defaultPanelOptions } from './models.gen';
import { GaugeSuggestionsSupplier } from './suggestions';

export const plugin = new PanelPlugin<PanelOptions>(GaugePanel)
  .useFieldConfig({
    useCustomConfig: (builder) => {
      builder.addNumberInput({
        path: 'neutral',
        name: t('plugins.gauge.neutral', 'Neutral'),
        description: t(
          'plugins.gauge.leave-empty-to-use-Min-as-neutral-point',
          'Leave empty to use Min as neutral point'
        ),
        category: [t('plugins.gauge.gauge', 'Gauge')],
        settings: {
          placeholder: t('plugins.gauge.auto', 'auto'),
        },
      });
    },
  })
  .setPanelOptions((builder) => {
    addStandardDataReduceOptions(builder);
    addOrientationOption(builder);
    builder
      .addBooleanSwitch({
        path: 'showThresholdLabels',
        name: t('plugins.gauge.show-threshold-labels', 'Show threshold labels'),
        description: t('plugins.gauge.render-the-threshold-values', 'Render the threshold values around the gauge bar'),
        defaultValue: defaultPanelOptions.showThresholdLabels,
      })
      .addBooleanSwitch({
        path: 'showThresholdMarkers',
        name: t('plugins.gauge.show-threshold-markers', 'Show threshold markers'),
        description: t(
          'plugins.gauge.renders-the-thresholds-as-an-outer-bar',
          'Renders the thresholds as an outer bar'
        ),
        defaultValue: defaultPanelOptions.showThresholdMarkers,
      });

    commonOptionsBuilder.addTextSizeOptions(builder);
  })
  .setPanelChangeHandler(gaugePanelChangedHandler)
  .setSuggestionsSupplier(new GaugeSuggestionsSupplier())
  .setMigrationHandler(gaugePanelMigrationHandler);
