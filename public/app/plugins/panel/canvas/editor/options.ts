import { PanelOptionsSupplier } from '@grafana/data/src/panel/PanelPlugin';
import { t } from 'app/core/internationalization';
import { CanvasElementOptions } from 'app/features/canvas';
import { ColorDimensionEditor, ResourceDimensionEditor } from 'app/features/dimensions/editors';
import { BackgroundSizeEditor } from 'app/features/dimensions/editors/BackgroundSizeEditor';

interface OptionSuppliers {
  addBackground: PanelOptionsSupplier<CanvasElementOptions>;
  addBorder: PanelOptionsSupplier<CanvasElementOptions>;
}

const getCategoryName = (str: string, type: string | undefined) => {
  if (type !== 'frame' && type !== undefined) {
    return [str + ` (${type})`];
  }
  return [str];
};

export const optionBuilder: OptionSuppliers = {
  addBackground: (builder, context) => {
    const typeText: { [key: string]: string } = {
      text: t('plugins.canvas-editor.text', 'text'),
      rectangle: t('plugins.canvas-editor.rectangle', 'rectangle'),
      'metric-value': t('plugins.canvas-editor.metric-value', 'metric-value'),
      icon: t('plugins.canvas-editor.icon', 'icon'),
    };
    const category = getCategoryName(t('plugins.canvas.background', 'Background'), typeText[context.options?.type]);
    builder
      .addCustomEditor({
        category,
        id: 'background.color',
        path: 'background.color',
        name: t('plugins.canvas.color', 'Color'),
        editor: ColorDimensionEditor,
        settings: {},
        defaultValue: {
          // Configured values
          fixed: '',
        },
      })
      .addCustomEditor({
        category,
        id: 'background.image',
        path: 'background.image',
        name: t('plugins.canvas.image', 'Image'),
        editor: ResourceDimensionEditor,
        settings: {
          resourceType: 'image',
        },
      })
      .addCustomEditor({
        category,
        id: 'background.size',
        path: 'background.size',
        name: t('plugins.canvas.image-size', 'Image size'),
        editor: BackgroundSizeEditor,
        settings: {
          resourceType: 'image',
        },
      });
  },

  addBorder: (builder, context) => {
    const typeText: { [key: string]: string } = {
      text: t('plugins.canvas-editor.text', 'text'),
      rectangle: t('plugins.canvas-editor.rectangle', 'rectangle'),
      'metric-value': t('plugins.canvas-editor.metric-value', 'metric-value'),
      icon: t('plugins.canvas-editor.icon', 'icon'),
    };
    const category = getCategoryName(t('plugins.canvas.border', 'Border'), typeText[context.options?.type]);
    builder.addSliderInput({
      category,
      path: 'border.width',
      name: t('plugins.canvas.width', 'width'),
      defaultValue: 2,
      settings: {
        min: 0,
        max: 20,
      },
    });

    if (context.options?.border?.width) {
      builder.addCustomEditor({
        category,
        id: 'border.color',
        path: 'border.color',
        name: t('plugins.canvas.color', 'Color'),
        editor: ColorDimensionEditor,
        settings: {},
        defaultValue: {
          // Configured values
          fixed: '',
        },
      });
    }
  },
};
