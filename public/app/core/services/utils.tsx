import { t } from 'app/core/internationalization';

const message: { [key: string]: string } = {
  'datasource added': t('message.datasource-added', 'Datasource added'),
};
const getMessage = (msg: string) => {
  const list: Array<{ [key: string]: string }> = [
    {
      msg: 'Datasource added',
      mewMsg: t('message.datasource-added', 'Datasource added'),
    },
  ];
  const findMsg = list.filter((l) => l.msg === msg)[0];
  if (findMsg) {
    return findMsg.newMsg;
  } else {
    return msg;
  }
};

export const getServiceMessage = (msg: string) => {
  const list: Array<{ [key: string]: string }> = [
    {
      msg: 'Datasource added',
      newMsg: t('message.datasource-added', 'Datasource added'),
    },
    {
      msg: 'Access denied',
      newMsg: t('message.access-denied', 'Access denied'),
    },
    {
      msg: "You'll need additional permissions to perform this action. Permissions needed: datasources:create",
      newMsg: t(
        'message.need-additional-permissions-to-perform-this-action',
        "You'll need additional permissions to perform this action. Permissions needed: datasources:create"
      ),
    },
    {
      msg: 'Error',
      newMsg: t('message.error', 'Error'),
    },
    {
      msg: 'Validation failed',
      newMsg: t('message.validation-failed', 'Validation failed'),
    },
    {
      msg: 'Unexpected error',
      newMsg: t('app.core.service.Unexpected-error', 'Unexpected error'),
    },
    {
      msg: 'Failed to update datasource',
      newMsg: t('app.core.service.failed-to-update-datasource', 'Failed to update datasource'),
    },
  ];
  const findMsg = list.filter((l) => l.msg === msg)[0];
  if (findMsg) {
    return findMsg.newMsg;
  } else {
    return msg;
  }
};
