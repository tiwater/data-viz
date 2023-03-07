import { css } from '@emotion/css';
import React, { SyntheticEvent } from 'react';

import {
  DataSourcePluginOptionsEditorProps,
  GrafanaTheme2,
  onUpdateDatasourceJsonDataOption,
  onUpdateDatasourceSecureJsonDataOption,
  SelectableValue,
  updateDatasourcePluginJsonDataOption,
  updateDatasourcePluginResetOption,
} from '@grafana/data';
import {
  Alert,
  FieldSet,
  InlineField,
  InlineFieldRow,
  InlineSwitch,
  Input,
  Link,
  SecretInput,
  Select,
  useStyles2,
} from '@grafana/ui';
import { NumberInput } from 'app/core/components/OptionsUI/NumberInput';
import { t, Trans } from 'app/core/internationalization';
import { ConnectionLimits } from 'app/features/plugins/sql/components/configuration/ConnectionLimits';
import { useMigrateDatabaseField } from 'app/features/plugins/sql/components/configuration/useMigrateDatabaseField';

import { MSSQLAuthenticationType, MSSQLEncryptOptions, MssqlOptions } from '../types';

export const ConfigurationEditor = (props: DataSourcePluginOptionsEditorProps<MssqlOptions>) => {
  const { options, onOptionsChange } = props;
  const styles = useStyles2(getStyles);
  const jsonData = options.jsonData;

  useMigrateDatabaseField(props);

  const onResetPassword = () => {
    updateDatasourcePluginResetOption(props, 'password');
  };

  const onDSOptionChanged = (property: keyof MssqlOptions) => {
    return (event: SyntheticEvent<HTMLInputElement>) => {
      onOptionsChange({ ...options, ...{ [property]: event.currentTarget.value } });
    };
  };

  const onSkipTLSVerifyChanged = (event: SyntheticEvent<HTMLInputElement>) => {
    updateDatasourcePluginJsonDataOption(props, 'tlsSkipVerify', event.currentTarget.checked);
  };

  const onEncryptChanged = (value: SelectableValue) => {
    updateDatasourcePluginJsonDataOption(props, 'encrypt', value.value);
  };

  const onAuthenticationMethodChanged = (value: SelectableValue) => {
    onOptionsChange({
      ...options,
      ...{
        jsonData: { ...jsonData, ...{ authenticationType: value.value } },
        secureJsonData: { ...options.secureJsonData, ...{ password: '' } },
        secureJsonFields: { ...options.secureJsonFields, ...{ password: false } },
        user: '',
      },
    });
  };

  const onConnectionTimeoutChanged = (connectionTimeout?: number) => {
    updateDatasourcePluginJsonDataOption(props, 'connectionTimeout', connectionTimeout ?? 0);
  };

  const authenticationOptions: Array<SelectableValue<MSSQLAuthenticationType>> = [
    {
      value: MSSQLAuthenticationType.sqlAuth,
      label: t('app.data-source.mssql.SQL-server-authentication', 'SQL Server Authentication'),
    },
    {
      value: MSSQLAuthenticationType.windowsAuth,
      label: t('app.data-source.mssql.windows-authentication', 'Windows Authentication'),
    },
  ];

  const encryptOptions: Array<SelectableValue<string>> = [
    { value: MSSQLEncryptOptions.disable, label: 'disable' },
    { value: MSSQLEncryptOptions.false, label: 'false' },
    { value: MSSQLEncryptOptions.true, label: 'true' },
  ];

  const shortWidth = 15;
  const longWidth = 46;
  const labelWidthSSL = 25;
  const labelWidthDetails = 20;

  return (
    <>
      <FieldSet label={t('app.data-source.mssql.mssql-connection', 'MS SQL Connection')} width={400}>
        <InlineField labelWidth={shortWidth} label="Host">
          <Input
            width={longWidth}
            name={t('app.data-source.mssql.host', 'host')}
            type="text"
            value={options.url || ''}
            placeholder="localhost:1433"
            onChange={onDSOptionChanged('url')}
          ></Input>
        </InlineField>
        <InlineField labelWidth={shortWidth} label={t('app.data-source.mssql.database', 'Database')}>
          <Input
            width={longWidth}
            name="database"
            value={jsonData.database || ''}
            placeholder={t('app.data-source.mssql.database-name', 'database name')}
            onChange={onUpdateDatasourceJsonDataOption(props, 'database')}
          ></Input>
        </InlineField>
        <InlineField
          label={t('app.data-source.mssql.authentication', 'Authentication')}
          labelWidth={shortWidth}
          htmlFor="authenticationType"
          tooltip={
            <ul className={styles.ulPadding}>
              <Trans i18nKey="app.data-source.mssql.SQL-Server-authentication-type">
                <li>
                  <i>SQL Server Authentication</i> This is the default mechanism to connect to MS SQL Server. Enter the
                  SQL Server Authentication login or the Windows Authentication login in the DOMAIN\User format.
                </li>
                <li>
                  <i>Windows Authentication</i> Windows Integrated Security - single sign on for users who are already
                  logged onto Windows and have enabled this option for MS SQL Server.
                </li>
              </Trans>
            </ul>
          }
        >
          <Select
            value={jsonData.authenticationType || MSSQLAuthenticationType.sqlAuth}
            inputId="authenticationType"
            options={authenticationOptions}
            onChange={onAuthenticationMethodChanged}
          ></Select>
        </InlineField>
        {jsonData.authenticationType === MSSQLAuthenticationType.windowsAuth ? null : (
          <InlineFieldRow>
            <InlineField labelWidth={shortWidth} label={t('app.data-source.mssql.user', 'User')}>
              <Input
                width={shortWidth}
                value={options.user || ''}
                placeholder={t('app.data-source.mssql.user', 'User')}
                onChange={onDSOptionChanged('user')}
              ></Input>
            </InlineField>
            <InlineField label={t('app.data-source.mssql.password', 'Password')} labelWidth={shortWidth}>
              <SecretInput
                width={shortWidth}
                placeholder={t('app.data-source.mssql.password', 'Password')}
                isConfigured={options.secureJsonFields && options.secureJsonFields.password}
                onReset={onResetPassword}
                onBlur={onUpdateDatasourceSecureJsonDataOption(props, 'password')}
              ></SecretInput>
            </InlineField>
          </InlineFieldRow>
        )}
      </FieldSet>

      <FieldSet label={t('app.data-source.mssql.TLS-SSL-Auth', 'TLS/SSL Auth')}>
        <InlineField
          labelWidth={labelWidthSSL}
          htmlFor="encrypt"
          tooltip={
            <Trans i18nKey="app.data-source.mssql.determines-whether-or-to-which">
              Determines whether or to which extent a secure SSL TCP/IP connection will be negotiated with the server.
              <ul className={styles.ulPadding}>
                <li>
                  <i>disable</i> - Data sent between client and server is not encrypted.
                </li>
                <li>
                  <i>false</i> - Data sent between client and server is not encrypted beyond the login packet. (default)
                </li>
                <li>
                  <i>true</i> - Data sent between client and server is encrypted.
                </li>
              </ul>
              If you&apos;re using an older version of Microsoft SQL Server like 2008 and 2008R2 you may need to disable
              encryption to be able to connect.
            </Trans>
          }
          label={t('app.data-source.mssql.encrypt', 'Encrypt')}
        >
          <Select
            options={encryptOptions}
            value={jsonData.encrypt || MSSQLEncryptOptions.disable}
            inputId="encrypt"
            onChange={onEncryptChanged}
          ></Select>
        </InlineField>

        {jsonData.encrypt === MSSQLEncryptOptions.true ? (
          <>
            <InlineField
              labelWidth={labelWidthSSL}
              htmlFor="skipTlsVerify"
              label={t('app.data-source.mssql.skip-TLS-verify', 'Skip TLS Verify')}
            >
              <InlineSwitch
                id="skipTlsVerify"
                onChange={onSkipTLSVerifyChanged}
                value={jsonData.tlsSkipVerify || false}
              ></InlineSwitch>
            </InlineField>
            {jsonData.tlsSkipVerify ? null : (
              <>
                <InlineField
                  labelWidth={labelWidthSSL}
                  tooltip={
                    <span>
                      <Trans i18nKey="app.data-source.mssql.path-to-file-containing-the">
                        Path to file containing the public key certificate of the CA that signed the SQL Server
                        certificate. Needed when the server certificate is self signed.
                      </Trans>
                    </span>
                  }
                  label={t('app.data-source.mssql.TLS-SSL-root-certificate', 'TLS/SSL Root Certificate')}
                >
                  <Input
                    value={jsonData.sslRootCertFile || ''}
                    onChange={onUpdateDatasourceJsonDataOption(props, 'sslRootCertFile')}
                    placeholder={t(
                      'app.data-source.mssql.TLS-SSL-root-certificate-file-path',
                      'TLS/SSL root certificate file path'
                    )}
                  ></Input>
                </InlineField>
                <InlineField
                  labelWidth={labelWidthSSL}
                  label={t('app.data-source.mssql.hostname-in-server-certificate', 'Hostname in server certificate')}
                >
                  <Input
                    placeholder={t(
                      'app.data-source.mssql.common-name-in-server-certificate',
                      'Common Name (CN) in server certificate'
                    )}
                    value={jsonData.serverName || ''}
                    onChange={onUpdateDatasourceJsonDataOption(props, 'serverName')}
                  ></Input>
                </InlineField>
              </>
            )}
          </>
        ) : null}
      </FieldSet>

      <ConnectionLimits
        labelWidth={shortWidth}
        jsonData={jsonData}
        onPropertyChanged={(property, value) => {
          updateDatasourcePluginJsonDataOption(props, property, value);
        }}
      ></ConnectionLimits>

      <FieldSet label={t('app.data-source.mssql.MS-SQL-details', 'MS SQL details')}>
        <InlineField
          tooltip={
            <span>
              <Trans i18nKey="app.data-source.mssql.lower-limit-for-the-auto">
                A lower limit for the auto group by time interval. Recommended to be set to write frequency, for example
                <code>1m</code> if your data is written every minute.
              </Trans>
            </span>
          }
          label={t('app.data-source.mssql.min-time-interval', 'Min time interval')}
          labelWidth={labelWidthDetails}
        >
          <Input
            placeholder="1m"
            value={jsonData.timeInterval || ''}
            onChange={onUpdateDatasourceJsonDataOption(props, 'timeInterval')}
          ></Input>
        </InlineField>
        <InlineField
          tooltip={
            <Trans i18nKey="app.data-source.mssql.the-number-of-seconds-to">
              <span>
                The number of seconds to wait before canceling the request when connecting to the database. The default
                is <code>0</code>, meaning no timeout.
              </span>
            </Trans>
          }
          label={t('app.data-source.mssql.connection-timeout', 'Connection timeout')}
          labelWidth={labelWidthDetails}
        >
          <NumberInput
            placeholder="60"
            min={0}
            value={jsonData.connectionTimeout}
            onChange={onConnectionTimeoutChanged}
          ></NumberInput>
        </InlineField>
      </FieldSet>

      <Alert title={t('app.data-source.mssql.user-permission', 'User Permission')} severity="info">
        <Trans i18nKey="app.data-source.mssql.the-database-user-should-only">
          The database user should only be granted SELECT permissions on the specified database and tables you want to
          query. Grafana does not validate that queries are safe so queries can contain any SQL statement. For example,
          statements like <code>USE otherdb;</code> and <code>DROP TABLE user;</code> would be executed. To protect
          against this we <em>highly</em> recommend you create a specific MS SQL user with restricted permissions.
        </Trans>
        {/* Check
        out the{' '}
        <Link rel="noreferrer" target="_blank" href="http://docs.grafana.org/features/datasources/mssql/">
          Microsoft SQL Server Data Source Docs
        </Link>{' '}
        for more information. */}
      </Alert>
    </>
  );
};

function getStyles(theme: GrafanaTheme2) {
  return {
    ulPadding: css({
      margin: theme.spacing(1, 0),
      paddingLeft: theme.spacing(5),
    }),
  };
}
