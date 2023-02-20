import { css } from '@emotion/css';
import React from 'react';

import { Button, Modal } from '@grafana/ui';
import { t, Trans } from 'app/core/internationalization';

import { DashboardModel } from '../../state';

import { SaveDashboardButton } from './SaveDashboardButton';

interface UnsavedChangesModalProps {
  dashboard: DashboardModel;
  onDiscard: () => void;
  onDismiss: () => void;
  onSaveSuccess?: () => void;
}

export const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  dashboard,
  onSaveSuccess,
  onDiscard,
  onDismiss,
}) => {
  return (
    <Modal
      isOpen={true}
      title={t('dashboard.save-dashboard.unsaved-changes', 'Unsaved changes')}
      onDismiss={onDismiss}
      icon="exclamation-triangle"
      className={css`
        width: 500px;
      `}
    >
      {/* t("dashboard.row-options.row-options","Row options") */}
      <h5>
        <Trans i18nKey="dashboard.save-dashboard.do-you-want-to-save-your-changes">
          Do you want to save your changes?
        </Trans>
      </h5>
      <Modal.ButtonRow>
        <Button variant="secondary" onClick={onDismiss} fill="outline">
          <Trans i18nKey="explore.cancel-button">Cancel</Trans>
        </Button>
        <Button variant="destructive" onClick={onDiscard}>
          <Trans i18nKey="dashboard.save-dashboard.discard">Discard</Trans>
        </Button>
        <SaveDashboardButton dashboard={dashboard} onSaveSuccess={onSaveSuccess} />
      </Modal.ButtonRow>
    </Modal>
  );
};
