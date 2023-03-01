import { SelectableValue } from '@grafana/data';
import {
  AxisPlacement,
  BarAlignment,
  GraphDrawStyle,
  GraphGradientMode,
  GraphTresholdsStyleMode,
  LineInterpolation,
  VisibilityMode,
  StackingMode,
} from '@grafana/schema';
import { t } from '../../../src/utils/i18n';

/**
 * @alpha
 */
export const graphFieldOptions = () => ({
  drawStyle: [
    { label: t('grafana-ui.u-plot.config.lines','Lines'), value: GraphDrawStyle.Line },
    { label: t('grafana-ui.u-plot.config.bars','Bars'), value: GraphDrawStyle.Bars },
    { label: t('grafana-ui.u-plot.config.points','Points'), value: GraphDrawStyle.Points },
  ] as Array<SelectableValue<GraphDrawStyle>>,

  lineInterpolation: [
    { description: t('grafana-ui.u-plot.config.linear','Linear'), value: LineInterpolation.Linear, icon: 'gf-interpolation-linear' },
    { description: t('grafana-ui.u-plot.config.smooth','Smooth'), value: LineInterpolation.Smooth, icon: 'gf-interpolation-smooth' },
    { description: t('grafana-ui.u-plot.config.step-before','Step before'), value: LineInterpolation.StepBefore, icon: 'gf-interpolation-step-before' },
    { description: t('grafana-ui.u-plot.config.step-after','Step after'), value: LineInterpolation.StepAfter, icon: 'gf-interpolation-step-after' },
  ] as Array<SelectableValue<LineInterpolation>>,

  barAlignment: [
    { description: t('grafana-ui.u-plot.config.before','Before'), value: BarAlignment.Before, icon: 'gf-bar-alignment-before' },
    { description: t('grafana-ui.u-plot.config.center','Center'), value: BarAlignment.Center, icon: 'gf-bar-alignment-center' },
    { description: t('grafana-ui.u-plot.config.after','After'), value: BarAlignment.After, icon: 'gf-bar-alignment-after' },
  ] as Array<SelectableValue<BarAlignment>>,

  showPoints: [
    { label: t('grafana-ui.u-plot.config.auto','Auto'), value: VisibilityMode.Auto, description: 'Show points when the density is low' },
    { label: t('grafana-ui.u-plot.config.always','Always'), value: VisibilityMode.Always },
    { label: t('grafana-ui.u-plot.config.never','Never'), value: VisibilityMode.Never },
  ] as Array<SelectableValue<VisibilityMode>>,

  axisPlacement: [
    { label: t('grafana-ui.u-plot.config.auto','Auto'), value: AxisPlacement.Auto, description: 'First field on the left, everything else on the right' },
    { label: t('grafana-ui.u-plot.config.left','Left'), value: AxisPlacement.Left },
    { label: t('grafana-ui.u-plot.config.right','Right'), value: AxisPlacement.Right },
    { label: t('grafana-ui.u-plot.config.hidden','Hidden'), value: AxisPlacement.Hidden },
  ] as Array<SelectableValue<AxisPlacement>>,

  fillGradient: [
    { label: t('grafana-ui.u-plot.config.none','None'), value: GraphGradientMode.None },
    { label: t('grafana-ui.u-plot.config.opacity','Opacity'), value: GraphGradientMode.Opacity, description: 'Enable fill opacity gradient' },
    { label: t('grafana-ui.u-plot.config.hue','Hue'), value: GraphGradientMode.Hue, description: 'Small color hue gradient' },
    {
      label: t('grafana-ui.u-plot.config.scheme','Scheme'),
      value: GraphGradientMode.Scheme,
      description: 'Use color scheme to define gradient',
    },
  ] as Array<SelectableValue<GraphGradientMode>>,

  stacking: [
    { label: t('grafana-ui.u-plot.config.off','Off'), value: StackingMode.None },
    { label: t('grafana-ui.u-plot.config.normal','Normal'), value: StackingMode.Normal },
    { label: '100%', value: StackingMode.Percent },
  ] as Array<SelectableValue<StackingMode>>,

  thresholdsDisplayModes: [
    { label: t('grafana-ui.u-plot.config.off','Off'), value: GraphTresholdsStyleMode.Off },
    { label: t('grafana-ui.u-plot.config.as-lines','As lines'), value: GraphTresholdsStyleMode.Line },
    { label: t('grafana-ui.u-plot.config.as-lines-dashed','As lines (dashed)'), value: GraphTresholdsStyleMode.Dashed },
    { label: t('grafana-ui.u-plot.config.as-filled-regions','As filled regions'), value: GraphTresholdsStyleMode.Area },
    { label: t('grafana-ui.u-plot.config.as-filled-regions-and-lines','As filled regions and lines'), value: GraphTresholdsStyleMode.LineAndArea },
    { label: t('grafana-ui.u-plot.config.as-filled-regions-and-lines-dashed','As filled regions and lines (dashed)'), value: GraphTresholdsStyleMode.DashedAndArea },
  ] as Array<SelectableValue<GraphTresholdsStyleMode>>,
})
