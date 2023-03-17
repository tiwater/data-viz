import React, { useCallback, useState } from 'react';
import { useAsync, useDebounce } from 'react-use';

import { Button, Icon, Input, Modal, useStyles2 } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { getConnectedDashboards } from '../../state/api';
import { getModalStyles } from '../../styles';
import { PanelModelWithLibraryPanel } from '../../types';
import { usePanelSave } from '../../utils/usePanelSave';

interface Props {
  panel: PanelModelWithLibraryPanel;
  folderUid: string;
  isUnsavedPrompt?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
  onDiscard: () => void;
}

export const SaveLibraryPanelModal = ({
  panel,
  folderUid,
  isUnsavedPrompt,
  onDismiss,
  onConfirm,
  onDiscard,
}: Props) => {
  const [searchString, setSearchString] = useState('');
  const dashState = useAsync(async () => {
    const searchHits = await getConnectedDashboards(panel.libraryPanel.uid);
    if (searchHits.length > 0) {
      return searchHits.map((dash) => dash.title);
    }

    return [];
  }, [panel.libraryPanel.uid]);

  const [filteredDashboards, setFilteredDashboards] = useState<string[]>([]);
  useDebounce(
    () => {
      if (!dashState.value) {
        return setFilteredDashboards([]);
      }

      return setFilteredDashboards(
        dashState.value.filter((dashName) => dashName.toLowerCase().includes(searchString.toLowerCase()))
      );
    },
    300,
    [dashState.value, searchString]
  );

  const { saveLibraryPanel } = usePanelSave();
  const styles = useStyles2(getModalStyles);
  const discardAndClose = useCallback(() => {
    onDiscard();
  }, [onDiscard]);

  const title = isUnsavedPrompt
    ? t('features.library-panels.Unsaved-library-panel-changes', 'Unsaved library panel changes')
    : t('features.library-panels.Save-library-panel', 'Save library panel');

  return (
    <Modal title={title} icon="save" onDismiss={onDismiss} isOpen={true}>
      <div>
        <p className={styles.textInfo}>
          {'This update will affect '}
          <strong>
            {panel.libraryPanel.meta?.connectedDashboards}{' '}
            {panel.libraryPanel.meta?.connectedDashboards === 1 ? 'dashboard' : 'dashboards'}.
          </strong>

          {t(
            'features.library-panels.The-following-dashboards-using',
            'The following dashboards using the panel will be affected:'
          )}
        </p>
        <Input
          className={styles.dashboardSearch}
          prefix={<Icon name="search" />}
          placeholder={t('features.library-panels.Search-affected-dashboards', 'Search affected dashboards')}
          value={searchString}
          onChange={(e) => setSearchString(e.currentTarget.value)}
        />
        {dashState.loading ? (
          <p>{t('features.library-panels.Loading-connected-dashboards', 'Loading connected dashboards')}...</p>
        ) : (
          <table className={styles.myTable}>
            <thead>
              <tr>
                <th>{t('features.library-panels.Dashboard-name', 'Dashboard name')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredDashboards.map((dashName, i) => (
                <tr key={`dashrow-${i}`}>
                  <td>{dashName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Modal.ButtonRow>
          <Button variant="secondary" onClick={onDismiss} fill="outline">
            {t('features.library-panels.Cancel', 'Cancel')}
          </Button>
          {isUnsavedPrompt && (
            <Button variant="destructive" onClick={discardAndClose}>
              {t('features.library-panels.Discard', 'Discard')}
            </Button>
          )}
          <Button
            onClick={() => {
              saveLibraryPanel(panel, folderUid).then(() => {
                onConfirm();
              });
            }}
          >
            {t('features.library-panels.Update-all', 'Update all')}
          </Button>
        </Modal.ButtonRow>
      </div>
    </Modal>
  );
};
