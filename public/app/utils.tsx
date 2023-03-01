import { PanelPluginMeta } from '@grafana/data';

import config from './core/config';
import { t } from './core/internationalization';

const getPluginIn18 = (): { [key: string]: { [key: string]: string } } => ({
  timeseries: {
    name: t('utils.plugin.timeseries', 'Time series'),
    description: t('utils.plugin.timeseries-description', 'Time based line, area and bar charts'),
  },
  barchart: {
    name: t('utils.plugin.barchart', 'Bar chart'),
    description: t('utils.plugin.barchart-description', 'Categorical charts with group support'),
  },
  stat: {
    name: t('utils.plugin.stat', 'Stat'),
    description: t('utils.plugin.stat-description', 'Big stat values & sparklines'),
  },
  gauge: {
    name: t('utils.plugin.gauge', 'Gauge'),
    description: t('utils.plugin.gauge-description', 'Standard gauge visualization'),
  },
  bargauge: {
    name: t('utils.plugin.bargauge', 'Bar gauge'),
    description: t('utils.plugin.bargauge-description', 'Horizontal and vertical gauges'),
  },
  table: {
    name: t('utils.plugin.table', 'Table'),
    description: t('utils.plugin.table-description', 'Supports many column styles'),
  },
  piechart: {
    name: t('utils.plugin.piechart', 'Pie chart'),
    description: t('utils.plugin.piechart-description', 'The new core pie chart visualization'),
  },
  'state-timeline': {
    name: t('utils.plugin.state-timeline', 'State timeline'),
    description: t('utils.plugin.state-timeline-description', 'State changes and durations'),
  },
  heatmap: {
    name: t('utils.plugin.heatmap', 'Heatmap'),
    description: t('utils.plugin.heatmap-description', 'Like a histogram over time'),
  },
  'status-history': {
    name: t('utils.plugin.status-history', 'Status history'),
    description: t('utils.plugin.status-history-description', 'Periodic status history'),
  },

  histogram: {
    name: t('utils.plugin.histogram', 'Histogram'),
    description: t('utils.plugin.histogram-description', 'Histogram'),
  },
  text: {
    name: t('utils.plugin.text', 'Text'),
    description: t('utils.plugin.text-description', 'Supports markdown and html content'),
  },
  alertlist: {
    name: t('utils.plugin.alertlist', 'Alert list'),
    description: t('utils.plugin.alertlist-description', 'Shows list of alerts and their current status'),
  },
  dashlist: {
    name: t('utils.plugin.dashlist', 'Dashboard list'),
    description: t('utils.plugin.dashlist-description', 'List of dynamic links to other dashboards'),
  },
  news: {
    name: t('utils.plugin.news', 'News'),
    description: t('utils.plugin.news-description', 'RSS feed reader'),
  },
  'aidanmountford-html-panel': {
    name: t('utils.plugin.aidanmountford-html-panel', 'HTML'),
    description: t('utils.plugin.aidanmountford-html-panel-description', 'HTML panel for grafana'),
  },
  annolist: {
    name: t('utils.plugin.annolist', 'Annotations list'),
    description: t('utils.plugin.annolist-description', 'List annotations'),
  },
  'bilibala-echarts-panel': {
    name: t('utils.plugin.bilibala-echarts-panel', 'Echarts'),
    description: t('utils.plugin.bilibala-echarts-panel-description', 'Echarts panel for Ticos'),
  },
  candlestick: {
    name: t('utils.plugin.candlestick', 'Candlestick'),
    description: t('utils.plugin.candlestick-description', 'Candlestick'),
  },
  canvas: {
    name: t('utils.plugin.canvas', 'Canvas'),
    description: t('utils.plugin.canvas-description', 'Explicit element placement'),
  },
  'grafana-echarts-panel': {
    name: t('utils.plugin.grafana-echarts-panel', 'Echarts'),
    description: t('utils.plugin.grafana-echarts-panel-description', 'Echarts Panel for Ticos'),
  },
  logs: {
    name: t('utils.plugin.logs', 'Logs'),
    description: t('utils.plugin.logs-description', 'Logs'),
  },
  nodeGraph: {
    name: t('utils.plugin.nodeGraph', 'Node Graph'),
    description: t('utils.plugin.nodeGraph-description', 'Node Graph'),
  },
  'orchestracities-map-panel': {
    name: t('utils.plugin.orchestracities-map-panel', 'Orchestra Cities Map'),
    description: t('utils.plugin.orchestracities-map-panel-description', 'Orchestra Cities Map'),
  },
  'ryantxu-annolist-panel': {
    name: t('utils.plugin.ryantxu-annolist-panel', 'Annotation List'),
    description: t('utils.plugin.ryantxu-annolist-panel-description', 'List of builtin Annotations'),
  },
  'speakyourcode-button-panel': {
    name: t('utils.plugin.speakyourcode-button-panel', 'Button Panel'),
    description: t('utils.plugin.speakyourcode-button-panel-description', 'button control panel'),
  },
  traces: {
    name: t('utils.plugin.traces', 'Traces'),
    description: t('utils.plugin.traces-description', 'Traces'),
  },
  'volkovlabs-echarts-panel': {
    name: t('utils.plugin.volkovlabs-echarts-panel', 'Apache ECharts'),
    description: t('utils.plugin.volkovlabs-echarts-panel-description', 'Apache ECharts panel'),
  },
  xychart: {
    name: t('utils.plugin.xychart', 'XY Chart'),
    description: '',
  },
  'yesoreyeram-boomtheme-panel': {
    name: t('utils.plugin.yesoreyeram-boomtheme-panel', 'Boom Theme'),
    description: t('utils.plugin.yesoreyeram-boomtheme-panel-description', 'Themes for Ticos'),
  },
  'aceiot-svg-panel': {
    name: 'ACE.SVG',
    description: t('utils.plugin.aceiot-svg-panel-description', 'SVG Visualization Panel'),
  },
  'orchestracities-iconstat-panel': {
    name: t('utils.plugin.orchestracities-iconstat-panel', 'Orchestra Cities Icon Stat Panel'),
    description: '',
  },
  'volkovlabs-image-panel': {
    name: t('utils.plugin.volkovlabs-image-panel', 'Base64 Image/Video/Audio/PDF'),
    description: t('utils.plugin.volkovlabs-image-panel-description', 'Base64 Image/Video/Audio/PDF panel'),
  },
  'snuids-svg-panel': {
    name: t('utils.plugin.snuids-svg-panel', 'Colored SVG Panel'),
    description: t('utils.plugin.snuids-svg-panel-description', 'A panel that displays values as colored svg images'),
  },
});
export const setPluginMeta = (plugin: PanelPluginMeta): PanelPluginMeta => {
  const pluginIn18 = getPluginIn18();
  return {
    ...plugin,
    name: pluginIn18[plugin.id] ? pluginIn18[plugin.id].name : plugin.name,
  };
};
export const setFilteredPluginTypes = (pluginTypes: PanelPluginMeta[]) => {
  const pluginIn18 = getPluginIn18();
  return pluginTypes
    .filter((plugin) => !(plugin.id === 'geomap'))
    .map((plugin) => ({
      ...plugin,
      name: pluginIn18[plugin.id] ? pluginIn18[plugin.id].name : plugin.name,
      info: {
        ...plugin.info,
        description: pluginIn18[plugin.id] ? pluginIn18[plugin.id].description : plugin.info.description,
        logos: {
          small: `${config.appUrl}${plugin.info.logos.small}`,
          large: `${config.appUrl}${plugin.info.logos.large}`,
        },
      },
    }));
};
