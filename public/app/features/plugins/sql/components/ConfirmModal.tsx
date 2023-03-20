import React, { useRef, useEffect } from 'react';

import { Button, Icon, Modal } from '@grafana/ui';
import { Trans } from 'app/core/internationalization';

type ConfirmModalProps = {
  isOpen: boolean;
  onCancel?: () => void;
  onDiscard?: () => void;
  onCopy?: () => void;
};
export function ConfirmModal({ isOpen, onCancel, onDiscard, onCopy }: ConfirmModalProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Moved from grafana/ui
  useEffect(() => {
    // for some reason autoFocus property did no work on this button, but this does
    if (isOpen) {
      buttonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Modal
      title={
        <div className="modal-header-title">
          <Icon name="exclamation-triangle" size="lg" />
          <span className="p-l-1">
            <Trans i18nKey="features.plugins.sql.warning">Warning</Trans>
          </span>
        </div>
      }
      onDismiss={onCancel}
      isOpen={isOpen}
    >
      <p>
        <Trans i18nKey="features.plugins.sql.builder-mode-does-not-display">
          Builder mode does not display changes made in code. The query builder will display the last changes you made
          in builder mode.
        </Trans>
      </p>
      <p>
        <Trans i18nKey="features.plugins.sql.do-you-want-to-copy-your">
          Do you want to copy your code to the clipboard?
        </Trans>
      </p>
      <Modal.ButtonRow>
        <Button type="button" variant="secondary" onClick={onCancel} fill="outline">
          <Trans i18nKey="features.plugins.sql.cancel">Cancel</Trans>
        </Button>
        <Button variant="destructive" type="button" onClick={onDiscard} ref={buttonRef}>
          <Trans i18nKey="features.plugins.sql.discard-code-and-switch">Discard code and switch</Trans>
        </Button>
        <Button variant="primary" onClick={onCopy}>
          <Trans i18nKey="features.plugins.sql.copy-code-and-switch">Copy code and switch</Trans>
        </Button>
      </Modal.ButtonRow>
    </Modal>
  );
}
