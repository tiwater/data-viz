import { css } from '@emotion/css';
import { sumBy } from 'lodash';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import useAsyncFn from 'react-use/lib/useAsyncFn';

import { Modal, ConfirmModal, Button } from '@grafana/ui';
import { config } from 'app/core/config';
import { t } from 'app/core/internationalization';
import { DashboardModel, PanelModel } from 'app/features/dashboard/state';
import { cleanUpDashboardAndVariables } from 'app/features/dashboard/state/actions';

import { useDashboardDelete } from './useDashboardDelete';

type DeleteDashboardModalProps = {
  hideModal(): void;
  dashboard: DashboardModel;
};

const mapDispatchToProps = {
  cleanUpDashboardAndVariables,
};

const connector = connect(null, mapDispatchToProps);

type Props = DeleteDashboardModalProps & ConnectedProps<typeof connector>;

const DeleteDashboardModalUnconnected = ({ hideModal, cleanUpDashboardAndVariables, dashboard }: Props) => {
  const isProvisioned = dashboard.meta.provisioned;
  const { onDeleteDashboard } = useDashboardDelete(dashboard.uid, cleanUpDashboardAndVariables);

  const [, onConfirm] = useAsyncFn(async () => {
    await onDeleteDashboard();
    hideModal();
  }, [hideModal]);

  const modalBody = getModalBody(dashboard.panels, dashboard.title);

  if (isProvisioned) {
    return <ProvisionedDeleteModal hideModal={hideModal} provisionedId={dashboard.meta.provisionedExternalId!} />;
  }

  return (
    <ConfirmModal
      isOpen={true}
      body={modalBody}
      onConfirm={onConfirm}
      onDismiss={hideModal}
      title={t('features.dashboard.delete', 'Delete')}
      icon="trash-alt"
      confirmText={t('features.dashboard.delete', 'Delete')}
    />
  );
};

const getModalBody = (panels: PanelModel[], title: string) => {
  const totalAlerts = sumBy(panels, (panel) => (panel.alert ? 1 : 0));
  return totalAlerts > 0 && !config.unifiedAlertingEnabled ? (
    <>
      <p>{t('features.dashboard.do-you-want-to-delete', 'Do you want to delete this dashboard?')}</p>
      <p>
        This dashboard contains {totalAlerts} alert{totalAlerts > 1 ? 's' : ''}. Deleting this dashboard also deletes
        those alerts.
      </p>
    </>
  ) : (
    <>
      <p>{t('features.dashboard.do-you-want-to-delete', 'Do you want to delete this dashboard?')}</p>
      <p>{title}</p>
    </>
  );
};

const ProvisionedDeleteModal = ({ hideModal, provisionedId }: { hideModal(): void; provisionedId: string }) => (
  <Modal
    isOpen={true}
    title={t('features.dashboard.cannot-delete-provisioned-dashboard', 'Cannot delete provisioned dashboard')}
    icon="trash-alt"
    onDismiss={hideModal}
    className={css`
      width: 500px;
    `}
  >
    <p>
      {t(
        'features.dashboard.this-dashboard-is-managed-by-Grafana',
        'This dashboard is managed by Grafana provisioning and cannot be deleted. Remove the dashboard from the config file to delete it.'
      )}
    </p>
    <p>
      <i>
        {t('features.dashboard.see', 'See')}{' '}
        <a
          className="external-link"
          href="https://grafana.com/docs/grafana/latest/administration/provisioning/#dashboards"
          target="_blank"
          rel="noreferrer"
        >
          {t('features.dashboard.documentation', 'documentation')}
        </a>{' '}
        {t('features.dashboard.for-more-information', 'for more information about provisioning.')}
      </i>
      <br />
      {t('features.dashboard.file-path', 'File path: ')}
      {provisionedId}
    </p>
    <Modal.ButtonRow>
      <Button variant="primary" onClick={hideModal}>
        {t('features.dashboard.OK', 'OK')}
      </Button>
    </Modal.ButtonRow>
  </Modal>
);

export const DeleteDashboardModal = connector(DeleteDashboardModalUnconnected);
