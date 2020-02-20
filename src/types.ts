import { ThresholdsConfig, ThresholdsMode } from '@grafana/data';

export interface PluginOptions {
  imageSize: number;
  textColor: string;
  borderColor: string;
  textFontSize: number;
  thresholds: ThresholdsConfig;
  useThreshold: boolean;
}

export const defaultOptions: PluginOptions = {
  imageSize: 80,
  textColor: '#ffffff',
  borderColor: '#ffffff',
  textFontSize: 14,
  thresholds: {mode: ThresholdsMode.Absolute, steps: []},
  useThreshold: false
}