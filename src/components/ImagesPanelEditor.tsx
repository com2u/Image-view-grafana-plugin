import React, { PureComponent } from 'react';
import { FormField, PanelOptionsGroup, ColorPicker, ThresholdsEditor, Switch, getTheme  } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';
import { PluginOptions } from '../types';
import { Threshold, ThresholdsMode } from '@grafana/data'

interface State {
  imageSize: number;
  textColor: string;
  borderColor: string;
  textFontSize: number;
  thresholds: {mode: ThresholdsMode.Absolute, steps: Threshold[]};
  useThreshold: boolean;
}

export class ImagesPanelEditor extends PureComponent<PanelEditorProps<PluginOptions>, State> {
  constructor(props) {
    super(props);

    this.state = {
      imageSize: props.options.imageSize,
      textColor: props.options.textColor,
      borderColor: props.options.borderColor,
      textFontSize: props.options.textFontSize,
      thresholds: props.options.thresholds,
      useThreshold: props.options.useThreshold
    }
  }

  onImageSizeChange = ({ target }) => this.setState({ imageSize: target.value })
  onUpdatePanel = () => this.props.onOptionsChange({
    ...this.props.options,
    imageSize: this.state.imageSize,
    textColor: this.state.textColor,
    borderColor: this.state.borderColor,
    textFontSize: this.state.textFontSize,
    thresholds: this.state.thresholds,
    useThreshold: this.state.useThreshold
  })
  onKeyUpImageSize = (e) => e.key === 'Enter' && this.onUpdatePanel()
  onTextColorChange = (textColor) => this.setState({ textColor }, () => this.onUpdatePanel())
  onBorderColorChange = (borderColor) => { this.setState({ borderColor }, () => this.onUpdatePanel()); }
  onThresholdChange = (thresholds) => this.setState({ thresholds }, () => this.onUpdatePanel())
  onUsingThresholdChange = () => this.setState({ useThreshold: !this.state.useThreshold }, () => this.onUpdatePanel())
  onTextSizeChange = ({ target }) => this.setState({ textFontSize: target.value }, () => this.onUpdatePanel())

  render() {
    const labelWidth = 10;
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
              label={`Text font size (${this.state.textFontSize})`}
              labelWidth={labelWidth}
              inputWidth={25}
              inputEl={
                <input type="range" value={this.state.textFontSize} onChange={this.onTextSizeChange} min={8} max={28}/>
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
                <div className="gf-form">
                  <FormField
                    label="Text color"
                    labelWidth={labelWidth}
                    inputWidth={25}
                    inputEl={
                      <ColorPicker
                        color={this.state.textColor}
                        onChange={this.onTextColorChange}
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