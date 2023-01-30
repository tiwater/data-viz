import { css } from '@emotion/css';
import React, { useState, useEffect } from 'react';

import { getDefaultTimeRange, GrafanaTheme2, QueryEditorProps } from '@grafana/data';
import { Alert, /* InlineField,*/ InlineLabel, /* Input, */ QueryField, useStyles2 } from '@grafana/ui';

import { ElasticDatasource } from '../../datasource';
import { useNextId } from '../../hooks/useNextId';
import { useDispatch } from '../../hooks/useStatelessReducer';
import { ElasticsearchOptions, ElasticsearchQuery } from '../../types';
import { isSupportedVersion } from '../../utils';

import { BucketAggregationsEditor } from './BucketAggregationsEditor';
import { ElasticsearchProvider } from './ElasticsearchQueryContext';
import { MetricAggregationsEditor } from './MetricAggregationsEditor';
import { metricAggregationConfig } from './MetricAggregationsEditor/utils';
import { /* changeAliasPattern, */ changeQuery } from './state';

export type ElasticQueryEditorProps = QueryEditorProps<ElasticDatasource, ElasticsearchQuery, ElasticsearchOptions>;

export const QueryEditor = ({ query, onChange, onRunQuery, datasource, range }: ElasticQueryEditorProps) => {
  if (!isSupportedVersion(datasource.esVersion)) {
    return (
      <Alert
        title={`Support for Elasticsearch versions after their end-of-life (currently versions < 7.10) was removed`}
      ></Alert>
    );
  }
  return (
    <ElasticsearchProvider
      datasource={datasource}
      onChange={onChange}
      onRunQuery={onRunQuery}
      query={query}
      range={range || getDefaultTimeRange()}
    >
      <QueryEditorForm value={query} />
    </ElasticsearchProvider>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  root: css`
    display: flex;
  `,
  queryFieldWrapper: css`
    flex-grow: 1;
    margin: 0 ${theme.spacing(0.5)} ${theme.spacing(0.5)} 0;
  `,
});

interface Props {
  value: ElasticsearchQuery;
}

export const ElasticSearchQueryField = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.queryFieldWrapper}>
      <QueryField
        query={value}
        // By default QueryField calls onChange if onBlur is not defined, this will trigger a rerender
        // And slate will claim the focus, making it impossible to leave the field.
        onBlur={() => {}}
        onChange={onChange}
        placeholder="Lucene 查询语句"
        portalOrigin="elasticsearch"
      />
    </div>
  );
};

export const O11yQueryField = ({
  value,
  placeholder,
  onChange,
}: {
  value?: string;
  placeholder: string;
  onChange: (v: string) => void;
}) => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.queryFieldWrapper}>
      <QueryField
        query={value}
        // By default QueryField calls onChange if onBlur is not defined, this will trigger a rerender
        // And slate will claim the focus, making it impossible to leave the field.
        onBlur={() => {}}
        onChange={onChange}
        placeholder={placeholder}
        portalOrigin="elasticsearch"
      />
    </div>
  );
};

const QueryEditorForm = ({ value }: Props) => {
  const dispatch = useDispatch();
  const nextId = useNextId();
  const styles = useStyles2(getStyles);

  const [projectId, setProjectId] = useState('');
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const query = Object.entries({ projectId, deviceId })
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:"${v}"`)
      .join('');
    value.query = query;
    dispatch(changeQuery(query));
  }, [projectId, deviceId]); // eslint-disable-line react-hooks/exhaustive-deps

  // To be considered a time series query, the last bucked aggregation must be a Date Histogram
  // const isTimeSeriesQuery = value?.bucketAggs?.slice(-1)[0]?.type === 'date_histogram';

  const showBucketAggregationsEditor = value.metrics?.every(
    (metric) => !metricAggregationConfig[metric.type].isSingleMetric
  );

  return (
    <>
      <div className={styles.root}>
        <InlineLabel width={17}>项目</InlineLabel>
        <O11yQueryField onChange={(v) => setProjectId(v)} value={projectId} placeholder="项目编号，支持'*'等通配符" />
      </div>

      <div className={styles.root}>
        <InlineLabel width={17}>设备</InlineLabel>
        <O11yQueryField onChange={(v) => setDeviceId(v)} value={deviceId} placeholder="设备编号，支持'*'等通配符" />
      </div>

      <div className={styles.root}>
        <InlineLabel width={17}>高级查询</InlineLabel>
        <ElasticSearchQueryField onChange={(query) => dispatch(changeQuery(query))} value={value?.query} />

        {/* <InlineField
          label="别名"
          labelWidth={15}
          disabled={!isTimeSeriesQuery}
          tooltip="Aliasing only works for timeseries queries (when the last group is 'Date Histogram'). For all other query types this field is ignored."
        >
          <Input
            id={`ES-query-${value.refId}_alias`}
            placeholder="别名模式"
            onBlur={(e) => dispatch(changeAliasPattern(e.currentTarget.value))}
            defaultValue={value.alias}
          />
        </InlineField> */}
      </div>

      <MetricAggregationsEditor nextId={nextId} />
      {showBucketAggregationsEditor && <BucketAggregationsEditor nextId={nextId} />}
    </>
  );
};
