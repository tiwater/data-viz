import { css } from '@emotion/css';
import uFuzzy from '@leeoniya/ufuzzy';
import debounce from 'debounce-promise';
import { debounce as debounceLodash } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import {
  Button,
  Card,
  Collapse,
  InlineField,
  InlineLabel,
  InlineSwitch,
  Input,
  Modal,
  MultiSelect,
  Select,
  Spinner,
  useStyles2,
} from '@grafana/ui';

import { PrometheusDatasource } from '../../datasource';
import { getMetadataHelp, getMetadataType } from '../../language_provider';
import { promQueryModeller } from '../PromQueryModeller';
import { regexifyLabelValuesQueryString } from '../shared/parsingUtils';
import { PromVisualQuery } from '../types';

type Props = {
  datasource: PrometheusDatasource;
  isOpen: boolean;
  query: PromVisualQuery;
  onClose: () => void;
  onChange: (query: PromVisualQuery) => void;
};

type MetricsData = MetricData[];

type MetricData = {
  value: string;
  type?: string;
  description?: string;
};

type PromFilterOption = {
  value: string;
  description: string;
};

const promTypes: PromFilterOption[] = [
  {
    value: 'counter',
    description:
      'A cumulative metric that represents a single monotonically increasing counter whose value can only increase or be reset to zero on restart.',
  },
  {
    value: 'gauge',
    description: 'A metric that represents a single numerical value that can arbitrarily go up and down.',
  },
  {
    value: 'histogram',
    description:
      'A histogram samples observations (usually things like request durations or response sizes) and counts them in configurable buckets.',
  },
  {
    value: 'summary',
    description:
      'A summary samples observations (usually things like request durations and response sizes) and can calculate configurable quantiles over a sliding time window.',
  },
];

export const placeholders = {
  browse: 'Browse metric names by text',
  metadataSearchSwicth: 'Browse by metadata type and description in addition to metric name',
  type: 'Counter, gauge, histogram, or summary',
  variables: 'Select a template variable for your metric',
  excludeNoMetadata: 'Exclude results with no metadata when filtering',
  setUseBackend: 'Use the backend to browse metrics and disable fuzzy search metadata browsing',
};

export const DEFAULT_RESULTS_PER_PAGE = 10;

export const MetricEncyclopediaModal = (props: Props) => {
  const uf = UseUfuzzy();

  const { datasource, isOpen, onClose, onChange, query } = props;

  const [variables, setVariables] = useState<Array<SelectableValue<string>>>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // metric list
  const [metrics, setMetrics] = useState<MetricsData>([]);
  const [hasMetadata, setHasMetadata] = useState<boolean>(true);
  const [haystack, setHaystack] = useState<string[]>([]);
  const [nameHaystack, setNameHaystack] = useState<string[]>([]);
  const [openTabs, setOpenTabs] = useState<string[]>([]);

  // pagination
  const [resultsPerPage, setResultsPerPage] = useState<number>(DEFAULT_RESULTS_PER_PAGE);
  const [pageNum, setPageNum] = useState<number>(1);

  // filters
  const [fuzzySearchQuery, setFuzzySearchQuery] = useState<string>('');
  const [fuzzyMetaSearchResults, setFuzzyMetaSearchResults] = useState<number[]>([]);
  const [fuzzyNameSearchResults, setNameFuzzySearchResults] = useState<number[]>([]);
  const [fullMetaSearch, setFullMetaSearch] = useState<boolean>(false);
  const [excludeNullMetadata, setExcludeNullMetadata] = useState<boolean>(false);
  const [selectedTypes, setSelectedTypes] = useState<Array<SelectableValue<string>>>([]);
  const [letterSearch, setLetterSearch] = useState<string | null>(null);

  // backend search metric names by text
  const [useBackend, setUseBackend] = useState<boolean>(false);

  const updateMetricsMetadata = useCallback(async () => {
    // *** Loading Gif
    setIsLoading(true);

    // Makes sure we loaded the metadata for metrics. Usually this is done in the start() method of the provider but we
    // don't use it with the visual builder and there is no need to run all the start() setup anyway.
    if (!datasource.languageProvider.metricsMetadata) {
      await datasource.languageProvider.loadMetricsMetadata();
    }

    // Error handling for when metrics metadata returns as undefined
    // *** Will have to handle metadata filtering if this happens
    // *** only display metrics fuzzy search, filter and pagination
    if (!datasource.languageProvider.metricsMetadata) {
      setHasMetadata(false);
      datasource.languageProvider.metricsMetadata = {};
    }

    // filter by adding the query.labels to the search?
    // *** do this in the filter???
    let metrics;
    if (query.labels.length > 0) {
      const expr = promQueryModeller.renderLabels(query.labels);
      metrics = (await datasource.languageProvider.getSeries(expr, true))['__name__'] ?? [];
    } else {
      metrics = (await datasource.languageProvider.getLabelValues('__name__')) ?? [];
    }

    let haystackData: string[] = [];
    let haystackNameData: string[] = [];
    let metricsData: MetricsData = metrics.map((m) => {
      const type = getMetadataType(m, datasource.languageProvider.metricsMetadata!);
      const description = getMetadataHelp(m, datasource.languageProvider.metricsMetadata!);

      // string[] = name + type + description
      haystackData.push(`${m} ${type} ${description}`);
      haystackNameData.push(m);
      return {
        value: m,
        type: type,
        description: description,
      };
    });

    // setting this by the backend if useBackend is true
    setMetrics(metricsData);
    setHaystack(haystackData);
    setNameHaystack(haystackNameData);

    setVariables(
      datasource.getVariables().map((v) => {
        return {
          value: v,
          label: v,
        };
      })
    );

    setIsLoading(false);
  }, [query, datasource]);

  useEffect(() => {
    updateMetricsMetadata();
  }, [updateMetricsMetadata]);

  const styles = useStyles2(getStyles);

  const typeOptions: SelectableValue[] = promTypes.map((t: PromFilterOption) => {
    return {
      value: t.value,
      label: t.value,
      description: t.description,
    };
  });

  function calculatePageList(metrics: MetricsData, resultsPerPage: number) {
    if (!metrics.length) {
      return [];
    }

    const calcResultsPerPage: number = resultsPerPage === 0 ? 1 : resultsPerPage;

    const pages = Math.floor(filterMetrics(metrics).length / calcResultsPerPage) + 1;

    return [...Array(pages).keys()].map((i) => i + 1);
  }

  function sliceMetrics(metrics: MetricsData, pageNum: number, resultsPerPage: number) {
    const calcResultsPerPage: number = resultsPerPage === 0 ? 1 : resultsPerPage;
    const start: number = pageNum === 1 ? 0 : (pageNum - 1) * calcResultsPerPage;
    const end: number = start + calcResultsPerPage;
    return metrics.slice(start, end);
  }

  function hasMetaDataFilters() {
    return selectedTypes.length > 0;
  }

  function fuzzySearch(query: string) {
    // search either the names or all metadata
    // fuzzy search go!

    if (fullMetaSearch) {
      // considered simply filtering indexes with reduce and includes
      // Performance comparison with 13,000 metrics searching metadata
      // Fuzzy 6326ms
      // Reduce & Includes 5541ms
      const metaIdxs = uf.filter(haystack, query.toLowerCase());
      setFuzzyMetaSearchResults(metaIdxs);
    } else {
      const nameIdxs = uf.filter(nameHaystack, query.toLowerCase());
      setNameFuzzySearchResults(nameIdxs);
    }
  }

  const debouncedFuzzySearch = debounceLodash((query: string) => {
    fuzzySearch(query);
  }, 300);

  /**
   * Filter
   *
   * @param metrics
   * @param skipLetterSearch
   * @returns
   */
  function filterMetrics(metrics: MetricsData, skipLetterSearch?: boolean): MetricsData {
    let filteredMetrics: MetricsData = metrics;

    if (fuzzySearchQuery || excludeNullMetadata || (letterSearch && !skipLetterSearch) || selectedTypes.length > 0) {
      filteredMetrics = filteredMetrics.filter((m: MetricData, idx) => {
        let keepMetric = false;

        // search by text
        if (fuzzySearchQuery) {
          if (useBackend) {
            // skip for backend!
            keepMetric = true;
          } else if (fullMetaSearch) {
            keepMetric = fuzzyMetaSearchResults.includes(idx);
          } else {
            keepMetric = fuzzyNameSearchResults.includes(idx);
          }
        }

        // user clicks the alphabet search
        // backend and frontend
        if (letterSearch && !skipLetterSearch) {
          const letters: string[] = [letterSearch, letterSearch.toLowerCase()];
          keepMetric = letters.includes(m.value[0]);
        }

        // select by type, counter, gauge, etc
        // skip for backend because no metadata is returned
        if (selectedTypes.length > 0 && !useBackend) {
          // return the metric that matches the type
          // return the metric if it has no type AND we are NOT excluding metrics without metadata

          // Matches type
          const matchesSelectedType = selectedTypes.some((t) => t.value === m.type);

          // missing type
          const hasNoType = !m.type;

          return matchesSelectedType || (hasNoType && !excludeNullMetadata);
        }

        return keepMetric;
      });
    }

    return filteredMetrics;
  }

  /**
   * The filtered and paginated metrics displayed in the modal
   * */
  function displayedMetrics(metrics: MetricsData) {
    const filteredSorted: MetricsData = filterMetrics(metrics).sort(alphabetically(true, hasMetaDataFilters()));

    const displayedMetrics: MetricsData = sliceMetrics(filteredSorted, pageNum, resultsPerPage);

    return displayedMetrics;
  }
  /**
   * The backend debounced search
   */
  const debouncedBackendSearch = useMemo(
    () =>
      debounce(async (metricText: string) => {
        const queryString = regexifyLabelValuesQueryString(metricText);

        const labelsParams = query.labels.map((label) => {
          return `,${label.label}="${label.value}"`;
        });

        const params = `label_values({__name__=~".*${queryString}"${
          query.labels ? labelsParams.join() : ''
        }},__name__)`;

        const results = datasource.metricFindQuery(params);

        const metrics = await results.then((results) => {
          return results.map((result) => {
            return {
              value: result.text,
            };
          });
        });

        setMetrics(metrics);
        setIsLoading(false);
      }, 300),
    [datasource, query.labels]
  );

  return (
    <Modal
      data-testid={testIds.metricModal}
      isOpen={isOpen}
      title="Browse Metrics"
      onDismiss={onClose}
      aria-label="Metric Encyclopedia"
    >
      <div className={styles.spacing}>
        Browse {metrics.length} metric{metrics.length > 1 ? 's' : ''} by text, by type, alphabetically or select a
        variable.
        {isLoading && (
          <div className={styles.inlineSpinner}>
            <Spinner></Spinner>
          </div>
        )}
      </div>
      {query.labels.length > 0 && (
        <div className={styles.spacing}>
          <i>These metrics have been pre-filtered by labels chosen in the label filters.</i>
        </div>
      )}
      <div className="gf-form">
        <Input
          data-testid={testIds.searchMetric}
          placeholder={placeholders.browse}
          value={fuzzySearchQuery}
          autoFocus
          onInput={(e) => {
            const value = e.currentTarget.value ?? '';
            setFuzzySearchQuery(value);
            if (useBackend && value === '') {
              // get all metrics data if a user erases everything in the input
              updateMetricsMetadata();
            } else if (useBackend) {
              setIsLoading(true);
              debouncedBackendSearch(value);
            } else {
              // do the search on the frontend
              debouncedFuzzySearch(value);
            }

            setPageNum(1);
          }}
        />
        {hasMetadata && !useBackend && (
          <InlineField label="" className={styles.labelColor} tooltip={<div>{placeholders.metadataSearchSwicth}</div>}>
            <InlineSwitch
              data-testid={testIds.searchWithMetadata}
              showLabel={true}
              value={fullMetaSearch}
              onChange={() => {
                setFullMetaSearch(!fullMetaSearch);
                setPageNum(1);
              }}
            />
          </InlineField>
        )}
        <InlineField label="" className={styles.labelColor} tooltip={<div>{placeholders.setUseBackend}</div>}>
          <InlineSwitch
            data-testid={testIds.setUseBackend}
            showLabel={true}
            value={useBackend}
            onChange={() => {
              const newVal = !useBackend;
              setUseBackend(newVal);
              if (newVal === false) {
                // rebuild the metrics metadata if we turn off useBackend
                updateMetricsMetadata();
              } else {
                // check if there is text in the browse search and update
                if (fuzzySearchQuery !== '') {
                  debouncedBackendSearch(fuzzySearchQuery);
                }
                // otherwise wait for user typing
              }

              setPageNum(1);
            }}
          />
        </InlineField>
      </div>
      {hasMetadata && !useBackend && (
        <>
          <div className="gf-form">
            <h6>Filter by Type</h6>
          </div>
          <div className="gf-form">
            <MultiSelect
              data-testid={testIds.selectType}
              inputId="my-select"
              options={typeOptions}
              value={selectedTypes}
              placeholder={placeholders.type}
              onChange={(v) => {
                // *** Filter by type
                // *** always include metrics without metadata but label it as unknown type
                // Consider tabs select instead of actual select or multi select
                setSelectedTypes(v);
                setPageNum(1);
              }}
            />
            {hasMetadata && (
              <InlineField label="" className={styles.labelColor} tooltip={<div>{placeholders.excludeNoMetadata}</div>}>
                <InlineSwitch
                  showLabel={true}
                  value={excludeNullMetadata}
                  onChange={() => {
                    setExcludeNullMetadata(!excludeNullMetadata);
                    setPageNum(1);
                  }}
                />
              </InlineField>
            )}
          </div>
        </>
      )}
      <div className="gf-form">
        <h6>Variables</h6>
      </div>
      <div className="gf-form">
        <Select
          inputId="my-select"
          options={variables}
          value={''}
          placeholder={placeholders.variables}
          onChange={(v) => {
            const value: string = v.value ?? '';
            onChange({ ...query, metric: value });
            onClose();
          }}
        />
      </div>
      <h5 className={`${styles.center} ${styles.topPadding}`}>Results</h5>
      <div className={`${styles.center} ${styles.bottomPadding}`}>
        {[
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'W',
          'X',
          'Y',
          'Z',
        ].map((letter, idx, coll) => {
          const active: boolean = filterMetrics(metrics, true).some((m: MetricData) => {
            return m.value[0] === letter || m.value[0] === letter?.toLowerCase();
          });

          // starts with letter search
          // filter by starts with letter
          // if same letter searched null out remove letter search
          function updateLetterSearch() {
            if (letterSearch === letter) {
              setLetterSearch(null);
            } else {
              setLetterSearch(letter);
            }
            setPageNum(1);
          }
          // selected letter to filter by
          const selectedClass: string = letterSearch === letter ? styles.selAlpha : '';
          // these letters are represented in the list of metrics
          const activeClass: string = active ? styles.active : styles.gray;

          return (
            <span
              onClick={active ? updateLetterSearch : () => {}}
              className={`${selectedClass} ${activeClass}`}
              key={letter}
              data-testid={'letter-' + letter}
            >
              {letter + ' '}
              {/* {idx !== coll.length - 1 ? '|': ''} */}
            </span>
          );
        })}
      </div>
      {metrics &&
        displayedMetrics(metrics).map((metric: MetricData, idx) => {
          return (
            <Collapse
              aria-label={`open and close ${metric.value} query starter card`}
              data-testid={testIds.metricCard}
              key={metric.value}
              label={metric.value}
              isOpen={openTabs.includes(metric.value)}
              collapsible={true}
              onToggle={() =>
                setOpenTabs((tabs) =>
                  // close tab if it's already open, otherwise open it
                  tabs.includes(metric.value) ? tabs.filter((t) => t !== metric.value) : [...tabs, metric.value]
                )
              }
            >
              <div className={styles.cardsContainer}>
                <Card className={styles.card}>
                  <Card.Description>
                    {metric.description && metric.type ? (
                      <>
                        Type: <span className={styles.metadata}>{metric.type}</span>
                        <br />
                        Description: <span className={styles.metadata}>{metric.description}</span>
                      </>
                    ) : (
                      <i>No metadata available</i>
                    )}
                  </Card.Description>
                  <Card.Actions>
                    {/* *** Make selecting a metric easier, consider click on text */}
                    <Button
                      size="sm"
                      aria-label="use this metric button"
                      data-testid={testIds.useMetric}
                      onClick={() => {
                        onChange({ ...query, metric: metric.value });
                        reportInteraction('grafana_prom_metric_encycopedia_tracking', {
                          metric: metric.value,
                          hasVariables: variables.length > 0,
                          hasMetadata: hasMetadata,
                          totalMetricCount: metrics.length,
                          fuzzySearchQuery: fuzzySearchQuery,
                          fullMetaSearch: fullMetaSearch,
                          selectedTypes: selectedTypes,
                          letterSearch: letterSearch,
                        });
                        onClose();
                      }}
                    >
                      Use this metric
                    </Button>
                  </Card.Actions>
                </Card>
              </div>
            </Collapse>
          );
        })}
      <br />
      <div className="gf-form">
        <InlineLabel width={20} className="query-keyword">
          Select Page
        </InlineLabel>
        <Select
          data-testid={testIds.searchPage}
          options={calculatePageList(metrics, resultsPerPage).map((p) => {
            return { value: p, label: '' + p };
          })}
          value={pageNum ?? 1}
          placeholder="select page"
          onChange={(e) => {
            const value = e.value ?? 1;
            setPageNum(value);
          }}
        />
        <InlineLabel width={20} className="query-keyword">
          # results per page
        </InlineLabel>
        <Input
          data-testid={testIds.resultsPerPage}
          value={resultsPerPage ?? 10}
          placeholder="results per page"
          onInput={(e) => {
            const value = +e.currentTarget.value;

            if (isNaN(value)) {
              return;
            }

            setResultsPerPage(value);
          }}
        />
      </div>
      <br />
      <Button aria-label="close metric encyclopedia modal" variant="secondary" onClick={onClose}>
        Close
      </Button>
    </Modal>
  );
};

function alphabetically(ascending: boolean, metadataFilters: boolean) {
  return function (a: MetricData, b: MetricData) {
    // equal items sort equally
    if (a.value === b.value) {
      return 0;
    }

    // *** NO METADATA? SORT LAST
    // undefined metadata sort after anything else
    // if filters are on
    if (metadataFilters) {
      if (a.type === undefined) {
        return 1;
      }
      if (b.type === undefined) {
        return -1;
      }
    }

    // otherwise, if we're ascending, lowest sorts first
    if (ascending) {
      return a.value < b.value ? -1 : 1;
    }

    // if descending, highest sorts first
    return a.value < b.value ? 1 : -1;
  };
}

function UseUfuzzy(): uFuzzy {
  const ref = useRef<uFuzzy>();

  if (!ref.current) {
    ref.current = new uFuzzy({
      intraMode: 1,
      intraIns: 1,
      intraSub: 1,
      intraTrn: 1,
      intraDel: 1,
    });
  }

  return ref.current;
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    cardsContainer: css`
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    `,
    spacing: css`
      margin-bottom: ${theme.spacing(1)};
    `,
    center: css`
      text-align: center;
      padding: 4px;
      width: 100%;
    `,
    topPadding: css`
      padding: 10px 0 0 0;
    `,
    bottomPadding: css`
      padding: 0 0 4px 0;
    `,
    card: css`
      width: 100%;
      display: flex;
      flex-direction: column;
    `,
    selAlpha: css`
      font-style: italic;
      cursor: pointer;
      color: #6e9fff;
    `,
    active: css`
      cursor: pointer;
    `,
    gray: css`
      color: grey;
    `,
    metadata: css`
      color: rgb(204, 204, 220);
    `,
    labelColor: css`
      color: #6e9fff;
    `,
    inlineSpinner: css`
      display: inline-block;
    `,
  };
};

export const testIds = {
  metricModal: 'metric-modal',
  searchMetric: 'search-metric',
  searchWithMetadata: 'search-with-metadata',
  selectType: 'select-type',
  metricCard: 'metric-card',
  useMetric: 'use-metric',
  searchPage: 'search-page',
  resultsPerPage: 'results-per-page',
  setUseBackend: 'set-use-backend',
};
