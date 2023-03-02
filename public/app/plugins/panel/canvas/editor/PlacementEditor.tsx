import React from 'react';
import { useObservable } from 'react-use';
import { Subject } from 'rxjs';

import { SelectableValue, StandardEditorProps } from '@grafana/data';
import { Field, HorizontalGroup, Icon, InlineField, InlineFieldRow, Select, VerticalGroup } from '@grafana/ui';
import { NumberInput } from 'app/core/components/OptionsUI/NumberInput';
import { t } from 'app/core/internationalization';
import { HorizontalConstraint, Placement, VerticalConstraint } from 'app/features/canvas';

import { PanelOptions } from '../models.gen';

import { ConstraintSelectionBox } from './ConstraintSelectionBox';
import { QuickPositioning } from './QuickPositioning';
import { CanvasEditorOptions } from './elementEditor';

const places: Array<keyof Placement> = ['top', 'left', 'bottom', 'right', 'width', 'height'];

type Props = StandardEditorProps<any, CanvasEditorOptions, PanelOptions>;

export function PlacementEditor({ item }: Props) {
  const placesLabel = {
    top: t('plugins.canvas.top', 'Top'),
    left: t('plugins.canvas.left', 'Left'),
    bottom: t('plugins.canvas.bottom', 'Bottom'),
    right: t('plugins.canvas.right', 'Right'),
    width: t('plugins.canvas.width', 'width'),
    height: t('plugins.canvas.height', 'height'),
  };
  const horizontalOptions: Array<SelectableValue<HorizontalConstraint>> = [
    { label: t('plugins.canvas.left', 'Left'), value: HorizontalConstraint.Left },
    { label: t('plugins.canvas.right', 'Right'), value: HorizontalConstraint.Right },
    { label: t('plugins.canvas.left-right', 'Left & right'), value: HorizontalConstraint.LeftRight },
    { label: t('plugins.canvas.center', 'Center'), value: HorizontalConstraint.Center },
    { label: t('plugins.canvas.scale', 'Scale'), value: HorizontalConstraint.Scale },
  ];

  const verticalOptions: Array<SelectableValue<VerticalConstraint>> = [
    { label: t('plugins.canvas.top', 'Top'), value: VerticalConstraint.Top },
    { label: t('plugins.canvas.bottom', 'Bottom'), value: VerticalConstraint.Bottom },
    { label: t('plugins.canvas.top-bottom', 'Top & bottom'), value: VerticalConstraint.TopBottom },
    { label: t('plugins.canvas.center', 'Center'), value: VerticalConstraint.Center },
    { label: t('plugins.canvas.scale', 'Scale'), value: VerticalConstraint.Scale },
  ];

  const settings = item.settings;

  // Will force a rerender whenever the subject changes
  useObservable(settings?.scene ? settings.scene.moved : new Subject());

  if (!settings) {
    return <div>Loading...</div>;
  }

  const element = settings.element;
  if (!element) {
    return <div>???</div>;
  }
  const { options } = element;
  const { placement, constraint: layout } = options;

  const reselectElementAfterChange = () => {
    setTimeout(() => {
      settings.scene.select({ targets: [element.div!] });
    });
  };

  const onHorizontalConstraintSelect = (h: SelectableValue<HorizontalConstraint>) => {
    onHorizontalConstraintChange(h.value!);
  };

  const onHorizontalConstraintChange = (h: HorizontalConstraint) => {
    element.options.constraint!.horizontal = h;
    element.setPlacementFromConstraint();
    settings.scene.revId++;
    settings.scene.save(true);
    reselectElementAfterChange();
  };

  const onVerticalConstraintSelect = (v: SelectableValue<VerticalConstraint>) => {
    onVerticalConstraintChange(v.value!);
  };

  const onVerticalConstraintChange = (v: VerticalConstraint) => {
    element.options.constraint!.vertical = v;
    element.setPlacementFromConstraint();
    settings.scene.revId++;
    settings.scene.save(true);
    reselectElementAfterChange();
  };

  const onPositionChange = (value: number | undefined, placement: keyof Placement) => {
    element.options.placement![placement] = value ?? element.options.placement![placement];
    element.applyLayoutStylesToDiv();
    settings.scene.clearCurrentSelection(true);
    reselectElementAfterChange();
  };

  const constraint = element.tempConstraint ?? layout ?? {};

  return (
    <div>
      <QuickPositioning onPositionChange={onPositionChange} settings={settings} element={element} />
      <br />
      <Field label={t('plugins.canvas.constraints', 'Constraints')}>
        <HorizontalGroup>
          <ConstraintSelectionBox
            onVerticalConstraintChange={onVerticalConstraintChange}
            onHorizontalConstraintChange={onHorizontalConstraintChange}
            currentConstraints={constraint}
          />
          <VerticalGroup>
            <HorizontalGroup>
              <Icon name="arrows-h" />
              <Select
                options={horizontalOptions}
                onChange={onHorizontalConstraintSelect}
                value={constraint.horizontal}
              />
            </HorizontalGroup>
            <HorizontalGroup>
              <Icon name="arrows-v" />
              <Select options={verticalOptions} onChange={onVerticalConstraintSelect} value={constraint.vertical} />
            </HorizontalGroup>
          </VerticalGroup>
        </HorizontalGroup>
      </Field>

      <br />

      <Field label={t('plugins.canvas.position', 'Position')}>
        <>
          {places.map((p) => {
            const v = placement![p];
            if (v == null) {
              return null;
            }
            return (
              <InlineFieldRow key={p}>
                <InlineField label={placesLabel[p]} labelWidth={8} grow={true}>
                  <NumberInput value={v} onChange={(v) => onPositionChange(v, p)} />
                </InlineField>
              </InlineFieldRow>
            );
          })}
        </>
      </Field>
    </div>
  );
}
