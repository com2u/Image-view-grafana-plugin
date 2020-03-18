import React, { PureComponent } from 'react';
import { FormField, PanelOptionsGroup, ColorPicker, ThresholdsEditor, Switch, getTheme  } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';
import { PluginOptions } from '../types';
import { Threshold, ThresholdsMode } from '@grafana/data'

interface State {
  imageSize: number;
  textColor: string;
  borderColor: string;
  overlayBorderColor: string;
  textFontSize: number;
  overlayStrokeSize: number;
  thresholds: {mode: ThresholdsMode.Absolute, steps: Threshold[]};
  overlayThresholds: {mode: ThresholdsMode.Absolute, steps: Threshold[]};
  useThreshold: boolean;
  useOverlayThreshold: boolean;
}

export class ImagesPanelEditor extends PureComponent<PanelEditorProps<PluginOptions>, State> {
  constructor(props) {
    super(props);

    this.state = {
      imageSize: props.options.imageSize,
      textColor: props.options.textColor,
      borderColor: props.options.borderColor,
      overlayBorderColor: props.options.overlayBorderColor,
      textFontSize: props.options.textFontSize,
      overlayStrokeSize: props.options.overlayStrokeSize,
      thresholds: props.options.thresholds,
      overlayThresholds: props.options.overlayThresholds,
      useThreshold: props.options.useThreshold,
      useOverlayThreshold: props.options.useOverlayThreshold
    }
  }

  onImageSizeChange = ({ target }) => this.setState({ imageSize: target.value })
  onUpdatePanel = () => this.props.onOptionsChange({
    ...this.props.options,
    imageSize: this.state.imageSize,
    textColor: this.state.textColor,
    borderColor: this.state.borderColor,
    overlayBorderColor: this.state.overlayBorderColor,
    textFontSize: this.state.textFontSize,
    overlayStrokeSize: this.state.overlayStrokeSize,
    thresholds: this.state.thresholds,
    overlayThresholds: this.state.overlayThresholds,
    useThreshold: this.state.useThreshold,    
    useOverlayThreshold: this.state.useOverlayThreshold
  })
  onKeyUpImageSize = (e) => e.key === 'Enter' && this.onUpdatePanel()
  onTextColorChange = (textColor) => this.setState({ textColor }, () => this.onUpdatePanel())
  onBorderColorChange = (borderColor) => { this.setState({ borderColor }, () => this.onUpdatePanel()); }
  onOverlayBorderColorChange = (overlayBorderColor) => { this.setState({ overlayBorderColor }, () => this.onUpdatePanel()); }
  onThresholdChange = (thresholds) => this.setState({ thresholds }, () => this.onUpdatePanel())
  onOverlayThresholdChange = (overlayThresholds) => this.setState({ overlayThresholds }, () => this.onUpdatePanel())
  onUsingThresholdChange = () => this.setState({ useThreshold: !this.state.useThreshold }, () => this.onUpdatePanel())
  onUsingOverlayThresholdChange = () => this.setState({ useOverlayThreshold: !this.state.useOverlayThreshold }, () => this.onUpdatePanel())
  onTextSizeChange = ({ target }) => this.setState({ textFontSize: target.value }, () => this.onUpdatePanel())
  onOverlayStrokeSizeChange = ({ target }) => this.setState({ overlayStrokeSize: target.value }, () => this.onUpdatePanel())

  render() {
    const labelWidth = 12;
    return (
      <>
        <PanelOptionsGroup title="Images options">
          <div className="gf-form">
            <FormField
              label="Image size"
              labelWidth={labelWidth}
              inputWidth={25}
              value={this.state.imageSize}
              onChange={this.onImageSizeChange}
              onBlur={this.onUpdatePanel}
              onKeyUp={this.onKeyUpImageSize}
              />
          </div>
          <div className="gf-form">
            <FormField
              label={`Text bbbbbbb font size (${this.state.textFontSize})`}
              labelWidth={labelWidth}
              inputWidth={25}
              inputEl={
                <input type="range" value={this.state.textFontSize} onChange={this.onTextSizeChange} min={8} max={28}/>
              }
              />
          </div>
          <div className="gf-form">
            <FormField
              label={`Overlay Stroke size (${this.state.overlayStrokeSize})`}
              labelWidth={labelWidth}
              inputWidth={25}
              inputEl={
                <input type="range" value={this.state.overlayStrokeSize} onChange={this.onOverlayStrokeSizeChange} min={1} max={8}/>
              }
              />
          </div>
          <div className="gf-form">
            <Switch
              label="Use threshold for border color"
              checked={this.state.useThreshold}
              onChange={this.onUsingThresholdChange}
              />    
          </div>
          {
            this.state.useThreshold && (
            <div className="gf-form">
              <ThresholdsEditor
                thresholds={this.state.thresholds}
                onChange={this.onThresholdChange}
                theme={getTheme("dark")}
              />
            </div>
            )
          }
          {
            !this.state.useThreshold && (
              <>
                <div className="gf-form">
                  <FormField
                    label="Border color"
                    labelWidth={labelWidth}
                    inputWidth={25}
                    inputEl={
                      <ColorPicker
                        color={this.state.borderColor}
                        onChange={this.onBorderColorChange}
                        enableNamedColors={true}
                      />
                    }
                    />
                </div>
              </>
            )
          }
          <div className="gf-form">
            <Switch
              label="Use threshold for Overlay Stroke color"
              checked={this.state.useOverlayThreshold}
              onChange={this.onUsingOverlayThresholdChange}
              />    
          </div>
          {
            this.state.useOverlayThreshold && (
              <div className="gf-form">
                <ThresholdsEditor
                  thresholds={this.state.overlayThresholds}
                  onChange={this.onOverlayThresholdChange}
                  theme={getTheme("dark")}
                />
              </div>
              )
          }
          {
            !this.state.useOverlayThreshold && (
              <>
                <div className="gf-form">
                  <FormField
                    label="Overlay Stroke color"
                    labelWidth={labelWidth}
                    inputWidth={25}
                    inputEl={
                      <ColorPicker
                        color={this.state.overlayBorderColor}
                        onChange={this.onOverlayBorderColorChange}
                        enableNamedColors={true}
                      />
                    }
                  />
                </div>
              </>
            )
          }
        </PanelOptionsGroup>
      </>
    )
  }
}