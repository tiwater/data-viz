import { css } from '@emotion/css';
import React from 'react';

import { ConfirmModal } from '@grafana/ui';
import { t } from 'app/core/internationalization';

interface Props {
  varName: string;
  isOpen: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ConfirmDeleteModal({ varName, isOpen = false, onConfirm, onDismiss }: Props) {
  return (
    <ConfirmModal
      title={t('features.variables.editor.delete-variable', 'Delete variable')}
      isOpen={isOpen}
      onConfirm={onConfirm}
      onDismiss={onDismiss}
      body={`
      ${t(
        'features.variables.editor.want-to-delete-variable',
        'Are you sure you want to delete variable'
      )} "${varName}"?
    `}
      modalClass={styles.modal}
      confirmText={t('features.variables.editor.delete', 'Delete')}
    />
  );
}

const styles = {
  modal: css({
    width: 'max-content',
    maxWidth: '80vw',
  }),
};
