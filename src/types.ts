import { ThresholdsConfig, ThresholdsMode } from '@grafana/data';

export interface PluginOptions {
  imageSize: number;
  textColor: string;
  borderColor: string;
  overlayBorderColor: string;
  textFontSize: number;
  overlayStrokeSize: number;
  thresholds: ThresholdsConfig;
  overlayThresholds: ThresholdsConfig;
  useThreshold: boolean;
  useOverlayThreshold: boolean;
}

export const defaultOptions: PluginOptions = {
  imageSize: 80,
  textColor: '#ffffff',
  borderColor: '#ffffff',
  overlayBorderColor: '#ffffff',
  textFontSize: 14,
  overlayStrokeSize: 2,
  thresholds: {mode: ThresholdsMode.Absolute, steps: []},
  overlayThresholds: {mode: ThresholdsMode.Absolute, steps: []},
  useThreshold: false,
  useOverlayThreshold: false
}