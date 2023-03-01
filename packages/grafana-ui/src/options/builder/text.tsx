import { PanelOptionsEditorBuilder } from '@grafana/data';
import { OptionsWithTextFormatting } from '@grafana/schema';

import { t } from '../../../src/utils/i18n';

/**
 * Adds common text control options to a visualization options
 * @param builder
 * @param withTitle
 * @public
 */
export function addTextSizeOptions<T extends OptionsWithTextFormatting>(
  builder: PanelOptionsEditorBuilder<T>,
  withTitle = true
) {
  if (withTitle) {
    builder.addNumberInput({
      path: 'text.titleSize',
      category: [t('grafana-ui.options.text-size','Text size')],
      name: t('grafana-ui.options.title','Title'),
      settings: {
        placeholder: t('grafana-ui.options.auto','Auto'),
        integer: false,
        min: 1,
        max: 200,
      },
      defaultValue: undefined,
    });
  }

  builder.addNumberInput({
    path: 'text.valueSize',
    category: [t('grafana-ui.options.text-size','Text size')],
    name: t('grafana-ui.options.value','Value'),
    settings: {
      placeholder: t('grafana-ui.options.auto','Auto'),
      integer: false,
      min: 1,
      max: 200,
    },
    defaultValue: undefined,
  });
}
