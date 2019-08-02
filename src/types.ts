import { Threshold } from '@grafana/data';

export interface PluginOptions {
  imageSize: number;
  textColor: string;
  borderColor: string;
  textFontSize: number;
  thresholds: Threshold[];
  useThreshold: boolean;
}

export const defaultOptions: PluginOptions = {
  imageSize: 80,
  textColor: '#ffffff',
  borderColor: '#ffffff',
  textFontSize: 14,
  thresholds: [],
  useThreshold: false
}