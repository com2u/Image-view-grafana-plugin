import React from 'react';
import { ImagesPanel } from './ImagesPanel';
import { PluginOptions } from '../types';
import { PanelProps } from '@grafana/ui';
import { dateTime } from '@grafana/data';
import sinon from 'sinon';
import Enzyme, { mount, Adapter } from 'enzyme';

Enzyme.configure({adapter: new Adapter()});

test('Test something', () => {
  const onOptionsChange = sinon.fake()
  const options: PluginOptions = {
    imageSize: 80,
    textColor: '#FFFFFF',
    borderColor: '#000000',
    textFontSize: 10,
    thresholds: [],
    useThreshold: false
  }
  const panelProps: PanelProps = {
    width: 100,
    height: 100,
    id: 1,
    data: { state: null, series: [] },
    timeRange: { from: dateTime(Date.now()-3600), to: dateTime(Date.now()), raw: { from: dateTime(Date.now()-3600), to: dateTime(Date.now()) } },
    onOptionsChange,
    options: null,
    renderCounter: 0,
    transparent: false,
    replaceVariables: null
  }
  const props = Object.assign({}, options, panelProps)
  const wrapper = mount(<ImagesPanel { ...props} />)
  const div = wrapper.find('div')
  expect(div.text()).toBe('There is no data for this panel')
})