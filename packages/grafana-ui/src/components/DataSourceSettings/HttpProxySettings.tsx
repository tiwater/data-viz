import React from 'react';

import { t } from '../../../src/utils/i18n';
import { InlineField } from '../Forms/InlineField';
import { InlineSwitch } from '../Switch/Switch';

import { HttpSettingsBaseProps } from './types';

const LABEL_WIDTH = 26;

export const HttpProxySettings: React.FC<HttpSettingsBaseProps> = ({
  dataSourceConfig,
  onChange,
  showForwardOAuthIdentityOption = true,
}) => {
  return (
    <>
      <div className="gf-form-inline">
        <InlineField
          label={t('app.plugins.data-source.TLS-client-auth', 'TLS Client Auth')}
          labelWidth={LABEL_WIDTH}
          disabled={dataSourceConfig.readOnly}
        >
          <InlineSwitch
            id="http-settings-tls-client-auth"
            value={dataSourceConfig.jsonData.tlsAuth || false}
            onChange={(event) => onChange({ ...dataSourceConfig.jsonData, tlsAuth: event!.currentTarget.checked })}
          />
        </InlineField>
        <InlineField
          label={t('app.plugins.data-source.with-ca-cert', 'With CA Cert')}
          tooltip={t(
            'app.plugins.data-source.needed-for-verifing-self-signed',
            'Needed for verifing self-signed TLS Certs'
          )}
          labelWidth={LABEL_WIDTH}
          disabled={dataSourceConfig.readOnly}
        >
          <InlineSwitch
            id="http-settings-ca-cert"
            value={dataSourceConfig.jsonData.tlsAuthWithCACert || false}
            onChange={(event) =>
              onChange({ ...dataSourceConfig.jsonData, tlsAuthWithCACert: event!.currentTarget.checked })
            }
          />
        </InlineField>
      </div>
      <div className="gf-form-inline">
        <InlineField
          label={t('app.plugins.data-source.skip-TLS-verify', 'Skip TLS Verify')}
          labelWidth={LABEL_WIDTH}
          disabled={dataSourceConfig.readOnly}
        >
          <InlineSwitch
            id="http-settings-skip-tls-verify"
            value={dataSourceConfig.jsonData.tlsSkipVerify || false}
            onChange={(event) =>
              onChange({ ...dataSourceConfig.jsonData, tlsSkipVerify: event!.currentTarget.checked })
            }
          />
        </InlineField>
      </div>
      {showForwardOAuthIdentityOption && (
        <div className="gf-form-inline">
          <InlineField
            label={t('app.plugins.data-source.forward-oauth-identity', 'Forward OAuth Identity')}
            tooltip={t(
              "app.plugins.data-source.forward-the-user-upstream'",
              "Forward the user's upstream OAuth identity to the data source (Their access token gets passed along)."
            )}
            labelWidth={LABEL_WIDTH}
            disabled={dataSourceConfig.readOnly}
          >
            <InlineSwitch
              id="http-settings-forward-oauth"
              value={dataSourceConfig.jsonData.oauthPassThru || false}
              onChange={(event) =>
                onChange({ ...dataSourceConfig.jsonData, oauthPassThru: event!.currentTarget.checked })
              }
            />
          </InlineField>
        </div>
      )}
    </>
  );
};
