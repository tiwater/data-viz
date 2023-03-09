---
keywords:
  - grafana
  - schema
title: TablePanelCfg kind
---
> Both documentation generation and kinds schemas are in active development and subject to change without prior notice.

## TablePanelCfg

#### Maturity: [experimental](../../../maturity/#experimental)
#### Version: 0.0



| Property       | Type                    | Required | Description |
|----------------|-------------------------|----------|-------------|
| `PanelOptions` | [object](#paneloptions) | **Yes**  |             |

### PanelOptions

| Property        | Type                                              | Required | Description                                                                          |
|-----------------|---------------------------------------------------|----------|--------------------------------------------------------------------------------------|
| `frameIndex`    | number                                            | **Yes**  | Represents the index of the selected frame Default: `0`.                             |
| `showHeader`    | boolean                                           | **Yes**  | Controls whether the panel should show the header Default: `true`.                   |
| `footer`        | [object](#footer)                                 | No       | Controls footer options Default: `map[countRows:false reducer:[] show:false]`.       |
| `showRowNums`   | boolean                                           | No       | Controls whether the columns should be numbered Default: `false`.                    |
| `showTypeIcons` | boolean                                           | No       | Controls whether the header should show icons for the column types Default: `false`. |
| `sortBy`        | [TableSortByFieldState](#tablesortbyfieldstate)[] | No       | Used to control row sorting                                                          |

### TableSortByFieldState

Sort by field state

| Property      | Type    | Required | Description                                   |
|---------------|---------|----------|-----------------------------------------------|
| `displayName` | string  | **Yes**  | Sets the display name of the field to sort by |
| `desc`        | boolean | No       | Flag used to indicate descending sort order   |

### Footer

Controls footer options

| Property | Type                              | Required | Description |
|----------|-----------------------------------|----------|-------------|
| `object` | Possible types are: [](#), [](#). |          |             |


