import React, { PureComponent } from "react";
import { PanelProps, getColorFromHexRgbOrName } from "@grafana/data";
import { PluginOptions } from '../types';

interface State {}
interface Props extends PanelProps<PluginOptions> {}

/**
 * Define colors for an image item
 * 
 * @interface 
 */
interface ItemColors {
  textColor: string;
  borderColor: string;
}

/**
 * Define indexes of images, labels and threshold values of each row from a data source
 * 
 * @interface
 */
interface DataIndexes {
  imageIndex: number;
  labelIndex: number;
  thresholdIndex: number;
  imageTypeIndex: number;
}

/**
 * The main plugin panel
 * 
 * @class
 */
export class ImagesPanel extends PureComponent<Props, State> {
  /**
   * Define a set of colors for labels and borders based on specified threshold and value for an item
   * @param {number} value A number value
   * @returns {ItemColors}
   */
  getColorsBasedOnValue (value: number): ItemColors {
    const { thresholds, useThreshold } = this.props.options;
    let color: string = '';
    if (!useThreshold) {
      return {
        textColor: getColorFromHexRgbOrName(this.props.options.textColor),
        borderColor: getColorFromHexRgbOrName(this.props.options.borderColor)
      }
    }
    thresholds.steps.forEach(threshold => {
      if (value > threshold.value) color = getColorFromHexRgbOrName(threshold.color)
    })
    return {
      textColor: color,
      borderColor: color
    }
  }

  /**
   * Render each row
   * 
   * @param rowIdx A row Index from the data received from a data source
   * @param indexes An index definition
   */
  renderItemFromRow(rowIdx, indexes: DataIndexes) {
    const { imageSize, textFontSize } = this.props.options
    const { imageIndex, labelIndex, thresholdIndex, imageTypeIndex } = indexes
    const record = {
      image: null, //row[imageIndex]
      label: null,
      thresholdValue: 0,
      imageType: 'bmp'
    }

    for (let i: number = 0; i < this.props.data.series[0].fields.length; ++i) {
      const field = this.props.data.series[0].fields[i];

      let valuesArr = field.values.toArray();

      if (field.name === 'image' && field.type === 'string') {
        if (imageIndex >= 0) record.image = valuesArr[rowIdx]
      } 
      else if (field.name === 'label' && (field.type === 'string' || field.type === 'number')) {
        if (labelIndex >= 0) record.label = valuesArr[rowIdx]
      } 
      else if (field.name === 'value' && field.type === 'number') {
        if (thresholdIndex >= 0) record.thresholdValue = valuesArr[rowIdx]
      } 
      else if (field.name === 'imagetype' && field.type === 'string') {
        if (imageTypeIndex >= 0) record.imageType = valuesArr[rowIdx]
      }

    }

    // if (labelIndex >= 0) record.label = row.get(1) //row[labelIndex]
    // if (thresholdIndex >= 0) record.thresholdValue = row.get(2) //row[thresholdIndex]
    // if (imageTypeIndex >= 0) record.imageType = row.get(3) //row[imageTypeIndex]

    const { textColor, borderColor } = this.getColorsBasedOnValue(record.thresholdValue)
    return (
      <div key={record.image} style={{width: (imageSize)+'px', margin: '0px 10px 10px 0px', padding: '4px', border: '3px solid', borderColor }}>
        <img src={`data:image/${record.imageType};base64,${record.image}`} style={{width: (imageSize-14)+'px'}}/>
        {record.label ? <div style={{ color: textColor, fontSize: textFontSize+'px'}}>{record.label}</div>: ''}
      </div>
    )
  }


  /**
   * Render the plugin
   */
  render() {
    const isThereData = this.props.data.state === 'Done' && this.props.data.series.length > 0
    
    if (!isThereData) {
      return (
        <div style={{ textAlign: 'center', lineHeight: this.props.height+'px' }}>There is no data for this panel</div>
      )
    }
    
    const indexes: DataIndexes = {
      imageIndex: -1,
      labelIndex: -1,
      thresholdIndex: -1,
      imageTypeIndex: -1
    }
    for (let i: number = 0; i < this.props.data.series[0].fields.length; ++i) {
      const field = this.props.data.series[0].fields[i]
      if (field.name === 'image' && field.type === 'string') {
        indexes.imageIndex = i
      } else if (field.name === 'label' && (field.type === 'string' || field.type === 'number')) {
        indexes.labelIndex = i
      } else if (field.name === 'value' && field.type === 'number') {
        indexes.thresholdIndex = i
      } else if (field.name === 'imagetype' && field.type === 'string') {
        indexes.imageTypeIndex = i
      }
    }

    if (indexes.imageIndex === -1) {
      return (
        <div style={{ textAlign: 'center', lineHeight: this.props.height+'px' }}>There are no images in the data</div>
      )
    }

    const rowLength = this.props.data.series[0].length;
    const rowData = new Array(rowLength);

    for (let rowIdx: number = 0; rowIdx < rowLength; ++rowIdx) {
      rowData[rowIdx] = this.renderItemFromRow(rowIdx, indexes)
    }

    const items = rowData.map((rowData, idx) => rowData);

    //const items = this.props.data.series[0].fields.map(field => this.renderItemFromRow(field.values, indexes))

    return (
      <div style={{ overflow: 'scroll', width: this.props.width, height: this.props.height }}>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {items}
        </div>
      </div>
    )
  }
}
