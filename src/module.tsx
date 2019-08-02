import { PanelPlugin } from '@grafana/ui';
import { ImagesPanel } from './components/ImagesPanel';
import { ImagesPanelEditor } from './components/ImagesPanelEditor';
import { PluginOptions, defaultOptions } from './types';

export const plugin = new PanelPlugin<PluginOptions>(ImagesPanel)

plugin.setDefaults(defaultOptions)
plugin.setEditor(ImagesPanelEditor)