import {
  FieldOverrideContext,
  FieldType,
  getFieldDisplayName,
  PanelPlugin,
  ReducerID,
  standardEditorsRegistry,
  identityOverrideProcessor,
} from '@grafana/data';
import { TableFieldOptions, TableCellOptions, TableCellDisplayMode } from '@grafana/schema';
import { t } from 'app/core/internationalization';

import { PaginationEditor } from './PaginationEditor';
import { TableCellOptionEditor } from './TableCellOptionEditor';
import { TablePanel } from './TablePanel';
import { tableMigrationHandler, tablePanelChangedHandler } from './migrations';
import { PanelOptions, defaultPanelOptions, defaultPanelFieldConfig } from './models.gen';
import { TableSuggestionsSupplier } from './suggestions';

// const footerCategory = 'Table footer';
// const cellCategory = ['Cell Options'];

export const plugin = new PanelPlugin<PanelOptions, TableFieldOptions>(TablePanel)
  .setPanelChangeHandler(tablePanelChangedHandler)
  .setMigrationHandler(tableMigrationHandler)
  .useFieldConfig({
    useCustomConfig: (builder) => {
      builder
        .addNumberInput({
          path: 'minWidth',
          name: t('plugins.table.minimum-column-width', 'Minimum column width'),
          description: t('plugins.table.the-minimum-width-for-column', 'The minimum width for column auto resizing'),
          settings: {
            placeholder: '150',
            min: 50,
            max: 500,
          },
          shouldApply: () => true,
          defaultValue: defaultPanelFieldConfig.minWidth,
        })
        .addNumberInput({
          path: 'width',
          name: t('plugins.table.column-width', 'Column width'),
          settings: {
            placeholder: t('plugins.table.auto', 'auto'),
            min: 20,
            max: 300,
          },
          shouldApply: () => true,
          defaultValue: defaultPanelFieldConfig.width,
        })
        .addRadio({
          path: 'align',
          name: t('plugins.table.column-alignment', 'Column alignment'),
          settings: {
            options: [
              { value: 'auto', label: t('plugins.table.auto', 'auto') },
              { value: 'left', label: t('plugins.table.left', 'left') },
              { value: 'center', label: t('plugins.table.center', 'center') },
              { value: 'right', label: t('plugins.table.right', 'right') },
            ],
          },
          defaultValue: defaultPanelFieldConfig.align,
        })
        .addCustomEditor<void, TableCellOptions>({
          id: 'cellOptions',
          path: 'cellOptions',
          name: t('plugins.table.cell-type', 'Cell Type'),
          editor: TableCellOptionEditor,
          override: TableCellOptionEditor,
          defaultValue: defaultPanelFieldConfig.cellOptions,
          process: identityOverrideProcessor,
          category: [t('plugins.table.cell-options', 'Cell Options')],
          shouldApply: () => true,
        })
        .addBooleanSwitch({
          path: 'inspect',
          name: t('plugins.table.cell-value-inspect', 'Cell value inspect'),
          description: t(
            'plugins.table.enable-cell-value-inspection',
            'Enable cell value inspection in a modal window'
          ),
          defaultValue: false,
          category: [t('plugins.table.cell-options', 'Cell Options')],
          showIf: (cfg) => {
            return (
              cfg.cellOptions.type === TableCellDisplayMode.Auto ||
              cfg.cellOptions.type === TableCellDisplayMode.JSONView ||
              cfg.cellOptions.type === TableCellDisplayMode.ColorText ||
              cfg.cellOptions.type === TableCellDisplayMode.ColorBackground
            );
          },
        })
        .addBooleanSwitch({
          path: 'filterable',
          name: t('plugins.table.column-filter', 'Column filter'),
          description: t('plugins.table.disables-field-filters-in-table', 'Enables/disables field filters in table'),
          defaultValue: defaultPanelFieldConfig.filterable,
        })
        .addBooleanSwitch({
          path: 'hidden',
          name: t('plugins.table.hide-in-table', 'Hide in table'),
          defaultValue: undefined,
          hideFromDefaults: true,
        });
    },
  })
  .setPanelOptions((builder) => {
    builder
      .addBooleanSwitch({
        path: 'showHeader',
        name: t('plugins.table.show-table-header', 'Show table header'),
        defaultValue: defaultPanelOptions.showHeader,
      })
      .addBooleanSwitch({
        path: 'footer.show',
        category: [t('plugins.table.table-footer', 'Table footer')],
        name: t('plugins.table.show-table-footer', 'Show table footer'),
        defaultValue: defaultPanelOptions.footer?.show,
      })
      .addCustomEditor({
        id: 'footer.reducer',
        category: [t('plugins.table.table-footer', 'Table footer')],
        path: 'footer.reducer',
        name: t('plugins.table.calculation', 'Calculation'),
        description: t('plugins.table.choose-a-reducer-function', 'Choose a reducer function / calculation'),
        editor: standardEditorsRegistry.get('stats-picker').editor as any,
        defaultValue: [ReducerID.sum],
        showIf: (cfg) => cfg.footer?.show,
      })
      .addBooleanSwitch({
        path: 'footer.countRows',
        category: [t('plugins.table.table-footer', 'Table footer')],
        name: t('plugins.table.count-rows', 'Count rows'),
        description: t('plugins.table.display-a-single-count-for', 'Display a single count for all data rows'),
        defaultValue: defaultPanelOptions.footer?.countRows,
        showIf: (cfg) => cfg.footer?.reducer?.length === 1 && cfg.footer?.reducer[0] === ReducerID.count,
      })
      .addMultiSelect({
        path: 'footer.fields',
        category: [t('plugins.table.table-footer', 'Table footer')],
        name: t('plugins.table.fields', 'Fields'),
        description: t('plugins.table.select-the-fields-that-should', 'Select the fields that should be calculated'),
        settings: {
          allowCustomValue: false,
          options: [],
          placeholder: t('plugins.table.all-numeric-fields', 'All Numeric Fields'),
          getOptions: async (context: FieldOverrideContext) => {
            const options = [];
            if (context && context.data && context.data.length > 0) {
              const frame = context.data[0];
              for (const field of frame.fields) {
                if (field.type === FieldType.number) {
                  const name = getFieldDisplayName(field, frame, context.data);
                  const value = field.name;
                  options.push({ value, label: name } as any);
                }
              }
            }
            return options;
          },
        },
        defaultValue: '',
        showIf: (cfg) =>
          (cfg.footer?.show && !cfg.footer?.countRows) ||
          (cfg.footer?.reducer?.length === 1 && cfg.footer?.reducer[0] !== ReducerID.count),
      })
      .addCustomEditor({
        id: 'footer.enablePagination',
        path: 'footer.enablePagination',
        name: t('plugins.table.enable-pagination', 'Enable pagination'),
        editor: PaginationEditor,
      });
  })
  .setSuggestionsSupplier(new TableSuggestionsSupplier());
