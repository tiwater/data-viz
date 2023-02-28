import React, { useState } from 'react';

import { SelectableValue } from '@grafana/data';
import { CollapsableSection, TagsInput, Select, Field, Input, Checkbox, Button, IconName } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { DashboardLink, DashboardModel } from '../../state/DashboardModel';

export const newLink: DashboardLink = {
  icon: 'external link',
  title: '新链接',
  tooltip: '',
  type: 'dashboards',
  url: '',
  asDropdown: false,
  tags: [],
  targetBlank: false,
  keepTime: false,
  includeVars: false,
};

export const linkIconMap: Record<string, IconName | undefined> = {
  'external link': 'external-link-alt',
  dashboard: 'apps',
  question: 'question-circle',
  info: 'info-circle',
  bolt: 'bolt',
  doc: 'file-alt',
  cloud: 'cloud',
};

const linkIconOptions = Object.keys(linkIconMap).map((key) => ({ label: key, value: key }));

type LinkSettingsEditProps = {
  editLinkIdx: number;
  dashboard: DashboardModel;
  onGoBack: () => void;
};

export const LinkSettingsEdit: React.FC<LinkSettingsEditProps> = ({ editLinkIdx, dashboard, onGoBack }) => {
  const linkTypeOptions = [
    { value: 'dashboards', label: t('features.dashboard.setting.dashboards', 'Dashboards') },
    { value: 'link', label: t('features.dashboard.setting.link', 'Link') },
  ];
  const [linkSettings, setLinkSettings] = useState(editLinkIdx !== null ? dashboard.links[editLinkIdx] : newLink);

  const onUpdate = (link: DashboardLink) => {
    const links = [...dashboard.links];
    links.splice(editLinkIdx, 1, link);
    dashboard.links = links;
    setLinkSettings(link);
  };

  const onTagsChange = (tags: string[]) => {
    onUpdate({ ...linkSettings, tags: tags });
  };

  const onTypeChange = (selectedItem: SelectableValue) => {
    const update = { ...linkSettings, type: selectedItem.value };

    // clear props that are no longe revant for this type
    if (update.type === 'dashboards') {
      update.url = '';
      update.tooltip = '';
    } else {
      update.tags = [];
    }

    onUpdate(update);
  };

  const onIconChange = (selectedItem: SelectableValue) => {
    onUpdate({ ...linkSettings, icon: selectedItem.value });
  };

  const onChange = (ev: React.FocusEvent<HTMLInputElement>) => {
    const target = ev.currentTarget;
    onUpdate({
      ...linkSettings,
      [target.name]: target.type === 'checkbox' ? target.checked : target.value,
    });
  };

  const isNew = linkSettings.title === newLink.title;

  return (
    <div style={{ maxWidth: '600px' }}>
      <Field label={t('features.dashboard.setting.title', 'Title')}>
        <Input name="title" id="title" value={linkSettings.title} onChange={onChange} autoFocus={isNew} />
      </Field>
      <Field label={t('features.dashboard.setting.type', 'Type')}>
        <Select inputId="link-type-input" value={linkSettings.type} options={linkTypeOptions} onChange={onTypeChange} />
      </Field>
      {linkSettings.type === 'dashboards' && (
        <>
          <Field label={t('features.dashboard.setting.with-tags', 'With tags')}>
            <TagsInput tags={linkSettings.tags} onChange={onTagsChange} />
          </Field>
        </>
      )}
      {linkSettings.type === 'link' && (
        <>
          <Field label={t('features.dashboard.setting.url', 'URL')}>
            <Input name="url" value={linkSettings.url} onChange={onChange} />
          </Field>
          <Field label={t('features.dashboard.setting.tooltip', 'Tooltip')}>
            <Input name="tooltip" value={linkSettings.tooltip} onChange={onChange} placeholder="Open dashboard" />
          </Field>
          <Field label={t('features.dashboard.setting.icon', 'Icon')}>
            <Select value={linkSettings.icon} options={linkIconOptions} onChange={onIconChange} />
          </Field>
        </>
      )}
      <CollapsableSection label={t('features.dashboard.setting.options', 'Options')} isOpen={true}>
        {linkSettings.type === 'dashboards' && (
          <Field>
            <Checkbox
              label={t('features.dashboard.setting.show-as-dropdown', 'Show as dropdown')}
              name="asDropdown"
              value={linkSettings.asDropdown}
              onChange={onChange}
            />
          </Field>
        )}
        <Field>
          <Checkbox
            label={t('features.dashboard.setting.include-current-time-range', 'Include current time range')}
            name="keepTime"
            value={linkSettings.keepTime}
            onChange={onChange}
          />
        </Field>
        <Field>
          <Checkbox
            label={t(
              'features.dashboard.setting.include-current-template-variable',
              'Include current template variable values'
            )}
            name="includeVars"
            value={linkSettings.includeVars}
            onChange={onChange}
          />
        </Field>
        <Field>
          <Checkbox
            label={t('features.dashboard.setting.open-link-in-new-tab', 'Open link in new tab')}
            name="targetBlank"
            value={linkSettings.targetBlank}
            onChange={onChange}
          />
        </Field>
      </CollapsableSection>
      <Button onClick={onGoBack}>{t('features.dashboard.setting.apply', 'Apply')}</Button>
    </div>
  );
};
