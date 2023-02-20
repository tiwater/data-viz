import pluralize from 'pluralize';
import React, { PureComponent } from 'react';

import {
  QueryEditorProps,
  SelectableValue,
  dataFrameFromJSON,
  rangeUtil,
  DataQueryRequest,
  DataFrame,
} from '@grafana/data';
import { config, getBackendSrv, getDataSourceSrv } from '@grafana/runtime';
import { InlineField, Select, Alert, Input, InlineFieldRow, InlineLabel } from '@grafana/ui';
import { hasAlphaPanels } from 'app/core/config';
import { t, Trans } from 'app/core/internationalization';
import { SearchQuery } from 'app/features/search/service';

import { GrafanaDatasource } from '../datasource';
import { defaultQuery, GrafanaQuery, GrafanaQueryType } from '../types';

import SearchEditor from './SearchEditor';

type Props = QueryEditorProps<GrafanaDatasource, GrafanaQuery>;

const labelWidth = 12;

interface State {
  channels: Array<SelectableValue<string>>;
  channelFields: Record<string, Array<SelectableValue<string>>>;
  folders?: Array<SelectableValue<string>>;
}

export class QueryEditor extends PureComponent<Props, State> {
  state: State = { channels: [], channelFields: {} };

  queryTypes: Array<SelectableValue<GrafanaQueryType>> = [
    {
      label: t('data-source.random-walk-options', 'Random Walk'),
      value: GrafanaQueryType.RandomWalk,
      description: t(
        'data-source.random-signal-within-the-selected-time-range',
        'Random signal within the selected time range'
      ),
    },
    {
      label: t('data-source.live-measurements-options', 'Live Measurements'),
      value: GrafanaQueryType.LiveMeasurements,
      description: t(
        'data-source.stream-real-time-measurements-from-grafana',
        'Stream real-time measurements from Grafana'
      ),
    },
    {
      label: t('data-source.list-public-files-options', 'List public files'),
      value: GrafanaQueryType.List,
      description: t(
        'data-source.show-directory-listings-for-public-resources',
        'Show directory listings for public resources'
      ),
    },
  ];

  constructor(props: Props) {
    super(props);

    if (config.featureToggles.panelTitleSearch && hasAlphaPanels) {
      this.queryTypes.push({
        label: 'Search',
        value: GrafanaQueryType.Search,
        description: 'Search for grafana resources',
      });
    }
  }

  loadChannelInfo() {
    getBackendSrv()
      .fetch({ url: 'api/live/list' })
      .subscribe({
        next: (v: any) => {
          const channelInfo = v.data?.channels as any[];
          if (channelInfo?.length) {
            const channelFields: Record<string, Array<SelectableValue<string>>> = {};
            const channels: Array<SelectableValue<string>> = channelInfo.map((c) => {
              if (c.data) {
                const distinctFields = new Set<string>();
                const frame = dataFrameFromJSON(c.data);
                for (const f of frame.fields) {
                  distinctFields.add(f.name);
                }
                channelFields[c.channel] = Array.from(distinctFields).map((n) => ({
                  value: n,
                  label: n,
                }));
              }
              return {
                value: c.channel,
                label: c.channel + ' [' + c.minute_rate + ' msg/min]',
              };
            });

            this.setState({ channelFields, channels });
          }
        },
      });
  }

  loadFolderInfo() {
    const query: DataQueryRequest<GrafanaQuery> = {
      targets: [{ queryType: GrafanaQueryType.List, refId: 'A' }],
    } as any;

    getDataSourceSrv()
      .get('-- Grafana --')
      .then((ds) => {
        const gds = ds as GrafanaDatasource;
        gds.query(query).subscribe({
          next: (rsp) => {
            if (rsp.data.length) {
              const names = (rsp.data[0] as DataFrame).fields[0];
              const folders = names.values.toArray().map((v) => ({
                value: v,
                label: v,
              }));
              this.setState({ folders });
            }
          },
        });
      });
  }

  componentDidMount() {
    this.loadChannelInfo();
  }

  onQueryTypeChange = (sel: SelectableValue<GrafanaQueryType>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, queryType: sel.value! });
    onRunQuery();

    // Reload the channel list
    this.loadChannelInfo();
  };

  onChannelChange = (sel: SelectableValue<string>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, channel: sel?.value });
    onRunQuery();
  };

  onFieldNamesChange = (item: SelectableValue<string>) => {
    const { onChange, query, onRunQuery } = this.props;
    let fields: string[] = [];
    if (Array.isArray(item)) {
      fields = item.map((v) => v.value);
    } else if (item.value) {
      fields = [item.value];
    }

    // When adding the first field, also add time (if it exists)
    if (fields.length === 1 && !query.filter?.fields?.length && query.channel) {
      const names = this.state.channelFields[query.channel] ?? [];
      const tf = names.find((f) => f.value === 'time' || f.value === 'Time');
      if (tf && tf.value && tf.value !== fields[0]) {
        fields = [tf.value, ...fields];
      }
    }

    onChange({
      ...query,
      filter: {
        ...query.filter,
        fields,
      },
    });
    onRunQuery();
  };

  checkAndUpdateValue = (key: keyof GrafanaQuery, txt: string) => {
    const { onChange, query, onRunQuery } = this.props;
    if (key === 'buffer') {
      let buffer: number | undefined;
      if (txt) {
        try {
          buffer = rangeUtil.intervalToSeconds(txt) * 1000;
        } catch (err) {
          console.warn('ERROR', err);
        }
      }
      onChange({
        ...query,
        buffer,
      });
    } else {
      onChange({
        ...query,
        [key]: txt,
      });
    }
    onRunQuery();
  };

  handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') {
      return;
    }
    this.checkAndUpdateValue('buffer', (e.target as any).value);
  };

  handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    this.checkAndUpdateValue('buffer', e.target.value);
  };

  renderMeasurementsQuery() {
    let { channel, filter, buffer } = this.props.query;
    let { channels, channelFields } = this.state;
    let currentChannel = channels.find((c) => c.value === channel);
    if (channel && !currentChannel) {
      currentChannel = {
        value: channel,
        label: channel,
        description: `Connected to ${channel}`,
      };
      channels = [currentChannel, ...channels];
    }

    const distinctFields = new Set<string>();
    const fields: Array<SelectableValue<string>> = channel ? channelFields[channel] ?? [] : [];
    // if (data && data.series?.length) {
    //   for (const frame of data.series) {
    //     for (const field of frame.fields) {
    //       if (distinctFields.has(field.name) || !field.name) {
    //         continue;
    //       }
    //       fields.push({
    //         value: field.name,
    //         label: field.name,
    //         description: `(${getFrameDisplayName(frame)} / ${field.type})`,
    //       });
    //       distinctFields.add(field.name);
    //     }
    //   }
    // }
    if (filter?.fields) {
      for (const f of filter.fields) {
        if (!distinctFields.has(f)) {
          fields.push({
            value: f,
            label: `${f} (not loaded)`,
            description: `Configured, but not found in the query results`,
          });
          distinctFields.add(f);
        }
      }
    }

    let formattedTime = '';
    if (buffer) {
      formattedTime = rangeUtil.secondsToHms(buffer / 1000);
    }

    return (
      <>
        <div className="gf-form">
          <InlineField label={t('data-source.channel-label', 'Channel')} grow={true} labelWidth={labelWidth}>
            <Select
              options={channels}
              value={currentChannel || ''}
              onChange={this.onChannelChange}
              allowCustomValue={true}
              backspaceRemovesValue={true}
              placeholder={t('data-source.select-measurements-channel-placeholder', 'Select measurements channel')}
              isClearable={true}
              noOptionsMessage={t('data-source.enter-channel-name', 'Enter channel name')}
              formatCreateLabel={(input: string) => `Connect to: ${input}`}
            />
          </InlineField>
        </div>
        {channel && (
          <div className="gf-form">
            <InlineField label={t('data-source.fields-label', 'Fields')} grow={true} labelWidth={labelWidth}>
              <Select
                options={fields}
                value={filter?.fields || []}
                onChange={this.onFieldNamesChange}
                allowCustomValue={true}
                backspaceRemovesValue={true}
                placeholder={t('data-source.all-fields-placeholder', 'All fields')}
                isClearable={true}
                noOptionsMessage={t('data-source.unable-to-list-all-fields', 'Unable to list all fields')}
                formatCreateLabel={(input: string) => `Field: ${input}`}
                isSearchable={true}
                isMulti={true}
              />
            </InlineField>
            <InlineField label="Buffer">
              <Input
                placeholder="Auto"
                width={12}
                defaultValue={formattedTime}
                onKeyDown={this.handleEnterKey}
                onBlur={this.handleBlur}
                spellCheck={false}
              />
            </InlineField>
          </div>
        )}

        <Alert
          title={t('data-source.grafana-live-measurements-options', 'Grafana Live - Measurements')}
          severity="info"
        >
          <Trans i18nKey="data-source.this-supports-real-time-event-streams">
            This supports real-time event streams in Grafana core. This feature is under heavy development. Expect the
            interfaces and structures to change as this becomes more production ready.
          </Trans>
        </Alert>
      </>
    );
  }

  onFolderChanged = (sel: SelectableValue<string>) => {
    const { onChange, query, onRunQuery } = this.props;
    onChange({ ...query, path: sel?.value });
    onRunQuery();
  };

  renderListPublicFiles() {
    let { path } = this.props.query;
    let { folders } = this.state;
    if (!folders) {
      folders = [];
      this.loadFolderInfo();
    }
    const currentFolder = folders.find((f) => f.value === path);
    if (path && !currentFolder) {
      folders = [
        ...folders,
        {
          value: path,
          label: path,
        },
      ];
    }

    return (
      <InlineFieldRow>
        <InlineField label={t('data-source.path-label', 'Path')} grow={true} labelWidth={labelWidth}>
          <Select
            options={folders}
            value={currentFolder || ''}
            onChange={this.onFolderChanged}
            allowCustomValue={true}
            backspaceRemovesValue={true}
            placeholder={t('data-source.select-folder-placeholder', 'Select folder')}
            isClearable={true}
            formatCreateLabel={(input: string) => `Folder: ${input}`}
          />
        </InlineField>
      </InlineFieldRow>
    );
  }

  renderSnapshotQuery() {
    const { query } = this.props;

    return (
      <InlineFieldRow>
        <InlineField label="Snapshot" grow={true} labelWidth={labelWidth}>
          <InlineLabel>{pluralize('frame', query.snapshot?.length ?? 0, true)}</InlineLabel>
        </InlineField>
      </InlineFieldRow>
    );
  }

  onSearchChange = (search: SearchQuery) => {
    const { query, onChange, onRunQuery } = this.props;

    onChange({
      ...query,
      search,
    });
    onRunQuery();
  };

  render() {
    const query = {
      ...defaultQuery,
      ...this.props.query,
    };

    const { queryType } = query;

    // Only show "snapshot" when it already exists
    let queryTypes = this.queryTypes;
    if (queryType === GrafanaQueryType.Snapshot) {
      queryTypes = [
        ...this.queryTypes,
        {
          label: 'Snapshot',
          value: queryType,
        },
      ];
    }

    return (
      <>
        {queryType === GrafanaQueryType.Search && (
          <Alert title={t('data-source.grafana-search', 'Grafana Search')} severity="info">
            <Trans i18nKey="data-source.using-this-datasource-to-call">
              Using this datasource to call the new search system is experimental, and subject to change at any time
              without notice.
            </Trans>
          </Alert>
        )}
        <InlineFieldRow>
          <InlineField label={t('data-source.query-type-label', 'Query type')} grow={true} labelWidth={labelWidth}>
            <Select
              options={queryTypes}
              value={queryTypes.find((v) => v.value === queryType) || queryTypes[0]}
              onChange={this.onQueryTypeChange}
            />
          </InlineField>
        </InlineFieldRow>
        {queryType === GrafanaQueryType.LiveMeasurements && this.renderMeasurementsQuery()}
        {queryType === GrafanaQueryType.List && this.renderListPublicFiles()}
        {queryType === GrafanaQueryType.Snapshot && this.renderSnapshotQuery()}
        {queryType === GrafanaQueryType.Search && (
          <SearchEditor value={query.search ?? {}} onChange={this.onSearchChange} />
        )}
      </>
    );
  }
}
