import { TransformerRegistryItem } from '@grafana/data';

import {
  filterByValueTransformRegistryItem,
  getFilterByValueTransformRegistryItem,
} from './FilterByValueTransformer/FilterByValueTransformerEditor';
import {
  getHeatmapTransformRegistryItem,
  heatmapTransformRegistryItem,
} from './calculateHeatmap/HeatmapTransformerEditor';
import {
  configFromQueryTransformRegistryItem,
  getConfigFromQueryTransformRegistryItem,
} from './configFromQuery/ConfigFromQueryTransformerEditor';
import {
  calculateFieldTransformRegistryItem,
  getCalculateFieldTransformRegistryItem,
} from './editors/CalculateFieldTransformerEditor';
import { getConcatenateTransformRegistryItem } from './editors/ConcatenateTransformerEditor';
import {
  convertFieldTypeTransformRegistryItem,
  getConvertFieldTypeTransformRegistryItem,
} from './editors/ConvertFieldTypeTransformerEditor';
import {
  filterFieldsByNameTransformRegistryItem,
  getFilterFieldsByNameTransformRegistryItem,
} from './editors/FilterByNameTransformerEditor';
import {
  filterFramesByRefIdTransformRegistryItem,
  getFilterFramesByRefIdTransformRegistryItem,
} from './editors/FilterByRefIdTransformerEditor';
import { getGroupByTransformRegistryItem, groupByTransformRegistryItem } from './editors/GroupByTransformerEditor';
import {
  getGroupingToMatrixTransformRegistryItem,
  groupingToMatrixTransformRegistryItem,
} from './editors/GroupingToMatrixTransformerEditor';
import {
  getHistogramTransformRegistryItem,
  histogramTransformRegistryItem,
} from './editors/HistogramTransformerEditor';
import {
  getJoinByFieldTransformerRegistryItem,
  joinByFieldTransformerRegistryItem,
} from './editors/JoinByFieldTransformerEditor';
import {
  getLabelsToFieldsTransformerRegistryItem,
  labelsToFieldsTransformerRegistryItem,
} from './editors/LabelsToFieldsTransformerEditor';
import { getLimitTransformRegistryItem, limitTransformRegistryItem } from './editors/LimitTransformerEditor';
import { getMergeTransformerRegistryItem, mergeTransformerRegistryItem } from './editors/MergeTransformerEditor';
import {
  getOrganizeFieldsTransformRegistryItem,
  organizeFieldsTransformRegistryItem,
} from './editors/OrganizeFieldsTransformerEditor';
import { getReduceTransformRegistryItem, reduceTransformRegistryItem } from './editors/ReduceTransformerEditor';
import {
  getRenameByRegexTransformRegistryItem,
  renameByRegexTransformRegistryItem,
} from './editors/RenameByRegexTransformer';
import {
  getSeriesToRowsTransformerRegistryItem,
  seriesToRowsTransformerRegistryItem,
} from './editors/SeriesToRowsTransformerEditor';
import { getSortByTransformRegistryItem, sortByTransformRegistryItem } from './editors/SortByTransformerEditor';
import {
  extractFieldsTransformRegistryItem,
  getExtractFieldsTransformRegistryItem,
} from './extractFields/ExtractFieldsTransformerEditor';
import {
  getJoinByLabelsTransformRegistryItem,
  joinByLabelsTransformRegistryItem,
} from './joinByLabels/JoinByLabelsTransformerEditor';
import {
  fieldLookupTransformRegistryItem,
  getFieldLookupTransformRegistryItem,
} from './lookupGazetteer/FieldLookupTransformerEditor';
import {
  getPartitionByValuesTransformRegistryItem,
  partitionByValuesTransformRegistryItem,
} from './partitionByValues/PartitionByValuesEditor';
import {
  getPrepareTimeseriesTransformerRegistryItem,
  prepareTimeseriesTransformerRegistryItem,
} from './prepareTimeSeries/PrepareTimeSeriesEditor';
import {
  getRowsToFieldsTransformRegistryItem,
  rowsToFieldsTransformRegistryItem,
} from './rowsToFields/RowsToFieldsTransformerEditor';
import { getSpatialTransformRegistryItem, spatialTransformRegistryItem } from './spatial/SpatialTransformerEditor';

export const getStandardTransformers = (): Array<TransformerRegistryItem<any>> => {
  return [
    getReduceTransformRegistryItem(),
    getFilterFieldsByNameTransformRegistryItem(),
    getRenameByRegexTransformRegistryItem(),
    getFilterFramesByRefIdTransformRegistryItem(),
    getFilterByValueTransformRegistryItem(),
    getOrganizeFieldsTransformRegistryItem(),
    getJoinByFieldTransformerRegistryItem(),
    getSeriesToRowsTransformerRegistryItem(),
    getConcatenateTransformRegistryItem(),
    getCalculateFieldTransformRegistryItem(),
    getLabelsToFieldsTransformerRegistryItem(),
    getGroupByTransformRegistryItem(),
    getSortByTransformRegistryItem(),
    getMergeTransformerRegistryItem(),
    getHistogramTransformRegistryItem(),
    getRowsToFieldsTransformRegistryItem(),
    getConfigFromQueryTransformRegistryItem(),
    getPrepareTimeseriesTransformerRegistryItem(),
    getConvertFieldTypeTransformRegistryItem(),
    getSpatialTransformRegistryItem(),
    getFieldLookupTransformRegistryItem(),
    getExtractFieldsTransformRegistryItem(),
    getHeatmapTransformRegistryItem(),
    getGroupingToMatrixTransformRegistryItem(),
    getLimitTransformRegistryItem(),
    getJoinByLabelsTransformRegistryItem(),
    getPartitionByValuesTransformRegistryItem(),
  ];
};
