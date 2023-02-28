import { css } from '@emotion/css';
import React from 'react';

import { Checkbox, Button, Tag, ModalsController } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { DecoratedRevisionModel } from '../DashboardSettings/VersionsSettings';

import { RevertDashboardModal } from './RevertDashboardModal';

type VersionsTableProps = {
  versions: DecoratedRevisionModel[];
  canCompare: boolean;
  onCheck: (ev: React.FormEvent<HTMLInputElement>, versionId: number) => void;
};

export const VersionHistoryTable = ({ versions, canCompare, onCheck }: VersionsTableProps) => (
  <table className="filter-table gf-form-group">
    <thead>
      <tr>
        <th className="width-4"></th>
        <th className="width-4">{t('features.variables.editor.version', 'Version')}</th>
        <th className="width-14">{t('features.variables.editor.date', 'Date')}</th>
        <th className="width-10">{t('features.variables.editor.updated-by', 'Updated by')}</th>
        <th>{t('features.variables.editor.notes', 'Notes')}</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {versions.map((version, idx) => (
        <tr key={version.id}>
          <td>
            <Checkbox
              aria-label={`Toggle selection of version ${version.version}`}
              className={css`
                display: inline;
              `}
              checked={version.checked}
              onChange={(ev) => onCheck(ev, version.id)}
              disabled={!version.checked && canCompare}
            />
          </td>
          <td>{version.version}</td>
          <td>{version.createdDateString}</td>
          <td>{version.createdBy}</td>
          <td>{version.message}</td>
          <td className="text-right">
            {idx === 0 ? (
              <Tag name="Latest" colorIndex={17} />
            ) : (
              <ModalsController>
                {({ showModal, hideModal }) => (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon="history"
                    onClick={() => {
                      showModal(RevertDashboardModal, {
                        version: version.version,
                        hideModal,
                      });
                    }}
                  >
                    Restore
                  </Button>
                )}
              </ModalsController>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
