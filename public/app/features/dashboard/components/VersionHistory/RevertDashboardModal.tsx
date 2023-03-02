import React, { useEffect } from 'react';

import { ConfirmModal } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { useDashboardRestore } from './useDashboardRestore';
export interface RevertDashboardModalProps {
  hideModal: () => void;
  version: number;
}

export const RevertDashboardModal: React.FC<RevertDashboardModalProps> = ({ hideModal, version }) => {
  // TODO: how should state.error be handled?
  const { state, onRestoreDashboard } = useDashboardRestore(version);

  useEffect(() => {
    if (state.loading === false && state.value) {
      hideModal();
    }
  }, [state, hideModal]);

  return (
    <ConfirmModal
      isOpen={true}
      title={t('features.dashboard.restore-version-title', 'Restore Version')}
      icon="history"
      onDismiss={hideModal}
      onConfirm={onRestoreDashboard}
      body={
        <p>
          {t(
            'features.dashboard.are-you-sure-you-want-to-restore',
            'Are you sure you want to restore the dashboard to version '
          )}
          {version}? {t('features.dashboard.all-unsaved-changes-will-be-lost', 'All unsaved changes will be lost.')}
        </p>
      }
      confirmText={`${t(
        'features.dashboard.yes-restore-to-version',
        'Yes, restore to version'
      )}${version}? {t('features.dashboard.all-unsaved-changes-will-be-lost','All unsaved changes will be lost.')} ${version}`}
    />
  );
};
