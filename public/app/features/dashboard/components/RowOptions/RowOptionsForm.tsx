import React, { FC, useCallback, useState } from 'react';

import { Button, Field, Form, Modal, Input } from '@grafana/ui';
import { t, Trans } from 'app/core/internationalization';

import { RepeatRowSelect } from '../RepeatRowSelect/RepeatRowSelect';

export type OnRowOptionsUpdate = (title: string, repeat?: string | null) => void;

export interface Props {
  title: string;
  repeat?: string | null;
  onUpdate: OnRowOptionsUpdate;
  onCancel: () => void;
}

export const RowOptionsForm: FC<Props> = ({ repeat, title, onUpdate, onCancel }) => {
  const [newRepeat, setNewRepeat] = useState<string | null | undefined>(repeat);
  const onChangeRepeat = useCallback((name?: string | null) => setNewRepeat(name), [setNewRepeat]);

  return (
    <Form
      defaultValues={{ title }}
      onSubmit={(formData: { title: string }) => {
        onUpdate(formData.title, newRepeat);
      }}
    >
      {({ register }) => (
        <>
          <Field label={t('dashboard.row-options.title-label', 'Title')}>
            <Input {...register('title')} type="text" />
          </Field>

          <Field label={t('dashboard.row-options.repeat-for-label', 'Repeat for')}>
            <RepeatRowSelect repeat={newRepeat} onChange={onChangeRepeat} />
          </Field>

          <Modal.ButtonRow>
            <Button type="button" variant="secondary" onClick={onCancel} fill="outline">
              <Trans i18nKey="explore.cancel-button">Cancel</Trans>
            </Button>
            <Button type="submit">
              <Trans i18nKey="dashboard.row-options.update-button">Update</Trans>
            </Button>
          </Modal.ButtonRow>
        </>
      )}
    </Form>
  );
};
