import { PanelPluginMeta } from '@grafana/data';

import config from './core/config';
import { t } from './core/internationalization';
import { DataSourcePluginCategory } from './types';

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
    info: {
      ...plugin.info,
      description: pluginIn18[plugin.id] ? pluginIn18[plugin.id].description : plugin.info.description,
      logos: {
        small:
          plugin.info.logos.small.indexOf(config.appUrl) > -1
            ? plugin.info.logos.small
            : `${config.appUrl}${plugin.info.logos.small}`,
        large:
          plugin.info.logos.large.indexOf(config.appUrl) > -1
            ? plugin.info.logos.large
            : `${config.appUrl}${plugin.info.logos.large}`,
      },
    },
  };
};
export const setFilteredPluginTypes = (pluginTypes: PanelPluginMeta[]) => {
  const list = [
    'timeseries',
    'barchart',
    'stat',
    'gauge',
    'bargauge',
    'table',
    'piechart',
    'text',
    'bilibala-echarts-panel',
    'canvas',
    'snuids-svg-panel',
    'yesoreyeram-boomtheme-panel',
    'ticos-gauge-panel',
    'ticos-theme-panel',
  ];
  return pluginTypes.filter((plugin) => list.indexOf(plugin.id) > -1).map((plugin) => setPluginMeta(plugin));
};

const getDataSourceIn18 = (): { [key: string]: string } => ({
  tsdb: t('utils.data-source.tsdb', 'Time series databases'),
  prometheus: t('utils.data-source.prometheus', 'Open source time series database & alerting'),
  graphite: t('utils.data-source.graphite', 'Open source time series database'),
  influxdb: t('utils.data-source.influxdb', 'Open source time series database'),
  opentsdb: t('utils.data-source.opentsdb', 'Open source time series database'),
  logging: t('utils.data-source.logging', 'Logging & document databases'),
  loki: t('utils.data-source.loki', 'Like Prometheus but for logs. OSS logging solution from Grafana Labs'),
  elasticsearch: t('utils.data-source.elasticsearch', 'Open source logging & analytics database'),
  'o11y-elasticsearch': t(
    'utils.data-source.o11y-elasticsearch',
    'Open source logging & analytics database for Observability'
  ),
  tracing: t('utils.data-source.tracing', 'Distributed tracing'),
  jaeger: t('utils.data-source.jaeger', 'Open source, end-to-end distributed tracing'),
  tempo: t(
    'utils.data-source.tempo',
    'High volume, minimal dependency trace storage.  OSS tracing solution from Grafana Labs.'
  ),
  zipkin: t('utils.data-source.zipkin', 'Placeholder for the distributed tracing system.'),
  sql: t('utils.data-source.sql', 'SQL'),
  mysql: t('utils.data-source.mysql', 'Data source for MySQL databases'),
  tsdpostgresb: t('utils.data-source.postgres', 'Data source for PostgreSQL and compatible databases'),
  mssql: t('utils.data-source.mssql', 'Data source for Microsoft SQL Server compatible databases'),
  cloud: t('utils.data-source.cloud', 'Cloud'),
  'grafana-azure-monitor-datasource': t(
    'utils.data-source.grafana-azure-monitor-datasource',
    'Data source for Microsoft Azure Monitor & Application Insights'
  ),
  cloudwatch: t('utils.data-source.cloudwatch', 'Data source for Amazon AWS monitoring service'),
  stackdriver: t(
    'utils.data-source.stackdriver',
    "Data source for Google's monitoring service (formerly named Stackdriver)"
  ),
  gcloud: t('utils.data-source.gcloud', 'Hosted Graphite, Prometheus, and Loki'),
  enterprise: t('utils.data-source.enterprise', 'Enterprise plugins'),
  'dlopes7-appdynamics-datasource': t(
    'utils.data-source.dlopes7-appdynamics-datasource',
    'AppDynamics integration and data source'
  ),
  'grafana-azuredevops-datasource': t('utils.data-source.grafana-azuredevops-datasource', 'Azure Devops datasource'),
  'grafana-datadog-datasource': t(
    'utils.data-source.grafana-datadog-datasource',
    'DataDog integration and data source'
  ),
  'grafana-dynatrace-datasource': t(
    'utils.data-source.grafana-dynatrace-datasource',
    'Visualize and explore Dynatrace data'
  ),
  'grafana-gitlab-datasource': t('utils.data-source.grafana-gitlab-datasource', 'GitLab integration and datasource'),
  'grafana-honeycomb-datasource': t(
    'utils.data-source.grafana-honeycomb-datasource',
    'Honeycomb integration and datasource'
  ),
  'grafana-jira-datasource': t('utils.data-source.grafana-jira-datasource', 'Jira integration and datasource'),
  'grafana-mongodb-datasource': t(
    'utils.data-source.grafana-mongodb-datasource',
    'MongoDB integration and data source'
  ),
  'grafana-newrelic-datasource': t(
    'utils.data-source.grafana-newrelic-datasource',
    'New Relic integration and data source'
  ),
  'grafana-oracle-datasource': t('utils.data-source.grafana-oracle-datasource', 'Visualize and explore Oracle SQL'),
  'grafana-saphana-datasource': t(
    'utils.data-source.grafana-saphana-datasource',
    'SAP HANA® integration and data source'
  ),
  'grafana-salesforce-datasource': t(
    'utils.data-source.grafana-salesforce-datasource',
    'Salesforce integration and datasource'
  ),
  'grafana-servicenow-datasource': t(
    'utils.data-source.grafana-servicenow-datasource',
    'ServiceNow integration and data source'
  ),
  'grafana-snowflake-datasource': t(
    'utils.data-source.grafana-snowflake-datasource',
    'Snowflake integration and data source'
  ),
  'grafana-splunk-datasource': t('utils.data-source.grafana-splunk-datasource', 'Visualize and explore Splunk logs'),
  'grafana-splunk-monitoring-datasource': t(
    'utils.data-source.grafana-splunk-monitoring-datasource',
    'SignalFx integration and datasource'
  ),
  'grafana-wavefront-datasource': t(
    'utils.data-source.grafana-wavefront-datasource',
    'Wavefront integration and data source'
  ),
  other: t('utils.data-source.other', 'Others'),
  alertmanager: '',
  'grafana-mqtt-datasource': t('utils.data-source.grafana-mqtt-datasource', 'MQTT Client Datasource Plugin'),
  testdata: t('utils.data-source.testdata', 'Generates test data in different forms'),
});
export const setFilteredDataSource = (dataSource: DataSourcePluginCategory[]) => {
  const in18 = getDataSourceIn18();
  const showDataSourceIds: string[] = [
    'logging',
    'sql',
    'tsdb',
    'influxdb',
    'opentsdb',
    'grafana-mongodb-datasource',
    'elasticsearch',
    'other',
    'mysql',
    'postgres',
    'mssql',
    'grafana-mqtt-datasource',
  ];
  return dataSource
    .filter((d) => showDataSourceIds.indexOf(d.id) > -1)
    .map((d) => {
      return {
        ...d,
        title: in18[d.id] ? in18[d.id] : d.title,
        plugins: d.plugins
          .filter((d) => showDataSourceIds.indexOf(d.id) > -1)
          .map((p) => {
            return {
              ...p,
              info: {
                ...d.info,
                description: in18[p.id] ? in18[p.id] : p.id,
                logos: {
                  small:
                    p.info.logos.small.indexOf(config.appUrl) > -1
                      ? p.info.logos.small
                      : `${config.appUrl}${p.info.logos.small}`,
                  large:
                    p.info.logos.large.indexOf(config.appUrl) > -1
                      ? p.info.logos.large
                      : `${config.appUrl}${p.info.logos.large}`,
                },
              },
            };
          }),
      };
    });
};
export const getTextI18n = (text: string) => {
  switch (text) {
    case 'Settings':
      return t('explore.rich-history.Settings', 'Settings');
    case 'Dashboards':
      return t('command-palette.section.dashboard-search-results', 'Dashboards');
    default:
      return text;
  }
};
