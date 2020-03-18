import React, { PureComponent } from "react";
import { PanelProps, getColorFromHexRgbOrName } from "@grafana/data";
import { PluginOptions, defaultOptions } from '../types';
//import ImageMapper from 'react-image-mapper';
import '../style/custom.css'


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
  overlayBorderColor: string;
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
  overlayThresholdIndex: number;
  imageTypeIndex: number;
  overlayTopIndex: number;
  overlayLeftIndex: number;
  overlayWidthIndex: number;
  overlayHeightIndex: number;
  
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
    const { thresholds, overlayThresholds, useThreshold, useOverlayThreshold } = this.props.options;
    let v_textColor: string = '';
    let v_borderColor: string = '';
    let v_overlayColor: string = '';

    if (!useThreshold && !useOverlayThreshold) {
      v_textColor = getColorFromHexRgbOrName(this.props.options.textColor);
      v_borderColor = getColorFromHexRgbOrName(this.props.options.borderColor);
      v_overlayColor = getColorFromHexRgbOrName(this.props.options.overlayBorderColor);
    }
    if (useThreshold && !useOverlayThreshold){
      thresholds.steps.forEach(threshold => {
        if (value > threshold.value) {
          v_textColor = getColorFromHexRgbOrName(threshold.color);
          v_borderColor = getColorFromHexRgbOrName(threshold.color);
        } 
      })
      v_overlayColor = getColorFromHexRgbOrName(this.props.options.overlayBorderColor);
    }
    if (!useThreshold && useOverlayThreshold){
      overlayThresholds.steps.forEach(overlayThreshold => {
        if (value > overlayThreshold.value) v_overlayColor = getColorFromHexRgbOrName(overlayThreshold.color)
      })
      v_textColor = getColorFromHexRgbOrName(this.props.options.textColor);
      v_borderColor = getColorFromHexRgbOrName(this.props.options.borderColor);
    }
    if (useThreshold && useOverlayThreshold){
      thresholds.steps.forEach(threshold => {
        if (value > threshold.value) {
          v_textColor = getColorFromHexRgbOrName(threshold.color);
          v_borderColor = getColorFromHexRgbOrName(threshold.color);
        } 
      })
      overlayThresholds.steps.forEach(overlayThreshold => {
        if (value > overlayThreshold.value) v_overlayColor = getColorFromHexRgbOrName(overlayThreshold.color)
      })
    }

    return {
      textColor: v_textColor,
      borderColor: v_borderColor,
      overlayBorderColor: v_overlayColor
    }
    
  }


  /**
   * Calculate Resized dimension size for overlay coordinates.
   * 
   * @param {number} coords  coordniate for the overlay (x, y, height or widtj)
   * @param {number} imageSize Given image size from Visualization UI
   * @returns {object} Updated new coordinates based on the new image size 
   */
  calculateOverlayDimSize = (coords, imageSize) => {
    const newCoords = {
      overlay_x: 0,
      overlay_y: 0,
      overlay_height: 0,
      overlay_width: 0
    }

    let defaultCoordsPerct_x:number = (coords.overlay_x * 100) / (defaultOptions.imageSize - defaultOptions.textFontSize);
    let defaultCoordsPerct_y:number = (coords.overlay_y * 100) / (defaultOptions.imageSize - defaultOptions.textFontSize);
    let defaultCoordsPerct_h:number = (coords.overlay_height * 100) / (defaultOptions.imageSize - defaultOptions.textFontSize);
    let defaultCoordsPerct_w:number = (coords.overlay_width * 100) / (defaultOptions.imageSize - defaultOptions.textFontSize);
    
    newCoords.overlay_x = ( (imageSize - defaultOptions.textFontSize) * defaultCoordsPerct_x) / 100;
    newCoords.overlay_y = ( (imageSize - defaultOptions.textFontSize) * defaultCoordsPerct_y) / 100;
    newCoords.overlay_height = ( (imageSize - defaultOptions.textFontSize) * defaultCoordsPerct_h) / 100;
    newCoords.overlay_width = ( (imageSize - defaultOptions.textFontSize)  * defaultCoordsPerct_w) / 100;
    
    //On the basis of image height x width ration calculation, width is 75% of height, it will use to propotionate the overlay width accordingly
    //Not required now - delete it later after testing
    //newCoords.overlay_x = (newCoords.overlay_y * 75) / 100;

    return newCoords;

  }

  /**
   * Render each row
   * 
   * @param rowIdx A row Index from the data received from a data source
   * @param indexes An index definition
   */
  renderItemFromRow(rowIdx, indexes: DataIndexes) {
    const { imageSize, textFontSize, overlayStrokeSize } = this.props.options
    const { imageIndex, labelIndex, thresholdIndex, overlayThresholdIndex, imageTypeIndex } = indexes
    const { overlayTopIndex, overlayLeftIndex, overlayWidthIndex, overlayHeightIndex } = indexes

    const coords = {
      overlay_x: 0,
      overlay_y: 0,
      overlay_width: 0,
      overlay_height: 0
    }

    const record = {
      image: null, //row[imageIndex]
      label: null,
      thresholdValue: 0,
      overlayThresholdValue: 0,
      imageType: 'bmp',
      overlay_x: coords.overlay_x + "px",
      overlay_y: coords.overlay_y + "px",
      overlay_width: coords.overlay_width + "px",
      overlay_height: coords.overlay_height + "px",
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
      else if (field.name === 'value1' && field.type === 'number') {
        if (thresholdIndex >= 0) record.thresholdValue = valuesArr[rowIdx]
      }
      else if (field.name === 'value2' && field.type === 'number') {
        if (overlayThresholdIndex >= 0) record.overlayThresholdValue = valuesArr[rowIdx]
      }
      else if (field.name === 'imagetype' && field.type === 'string') {
        if (imageTypeIndex >= 0) record.imageType = valuesArr[rowIdx]
      }
      else if (field.name === 'top' && field.type === 'number') {
        if (overlayTopIndex >= 0) coords.overlay_x = valuesArr[rowIdx]
      }
      else if (field.name === 'left' && field.type === 'number') {
        if (overlayLeftIndex >= 0) coords.overlay_y = valuesArr[rowIdx]
      }
      else if (field.name === 'width' && field.type === 'number') {
        if (overlayWidthIndex >= 0) coords.overlay_width = valuesArr[rowIdx]
      }
      else if (field.name === 'height' && field.type === 'number') {
        if (overlayHeightIndex >= 0) coords.overlay_height = valuesArr[rowIdx]
      }

    }

    //Testing purpose - Calculate Overlay Coordinates
    /* coords.overlay_x = 15;
    coords.overlay_y = 15;
    coords.overlay_height = 20;
    coords.overlay_width = 20; */

    const newCoords = this.calculateOverlayDimSize(coords, imageSize);

    record.overlay_x = newCoords.overlay_x + "px";
    record.overlay_y = newCoords.overlay_y + "px";
    record.overlay_width = newCoords.overlay_width + "px";
    record.overlay_height = newCoords.overlay_height + "px";

    const { textColor, borderColor } = this.getColorsBasedOnValue(record.thresholdValue)
    const { overlayBorderColor } = this.getColorsBasedOnValue(record.overlayThresholdValue)

    return (
      <div key={record.image} style={{width: (imageSize)+'px', margin: '0px 10px 10px 0px', padding: '4px', border: '3px solid', borderColor }}>
        <div className="image-container">
          <div className="overlay">
            <div style={{border: `solid ${overlayStrokeSize + 'px'} ${overlayBorderColor}`, height: `${record.overlay_height}`, 
                      width: `${record.overlay_width}`, marginLeft: `${record.overlay_x}`, marginTop: `${record.overlay_y}`}}>
            </div>
          </div>
          <img src={`data:image/${record.imageType};base64,${record.image}`} style={{width: (imageSize-14)+'px'}}/>
          {/* <ImageMapper src={`data:image/${record.imageType};base64,${record.image}`} width={(imageSize-14)} imgWidth={(imageSize-14)} 
            map={imageOverlayMap} onLoad={() => this.imageLoad()} strokeColor={"red"} lineWidth={6} active={true}/> */}
          
          {record.label ? <div style={{ color: textColor, fontSize: textFontSize+'px'}}>{record.label}</div>: ''}
        </div>
        
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
      overlayThresholdIndex: -1,
      imageTypeIndex: -1,
      overlayTopIndex: -1,
      overlayLeftIndex: -1,
      overlayWidthIndex: -1,
      overlayHeightIndex: -1
    }

    for (let i: number = 0; i < this.props.data.series[0].fields.length; ++i) {
      const field = this.props.data.series[0].fields[i]

      if (field.name === 'image' && field.type === 'string') {
        indexes.imageIndex = i
      } else if (field.name === 'label' && (field.type === 'string' || field.type === 'number')) {
        indexes.labelIndex = i
      } else if (field.name === 'value1' && field.type === 'number') {
        indexes.thresholdIndex = i
      } else if (field.name === 'value2' && field.type === 'number') {
        indexes.overlayThresholdIndex = i
      } else if (field.name === 'imagetype' && field.type === 'string') {
        indexes.imageTypeIndex = i
      } else if (field.name === 'top' && field.type === 'number') {
        indexes.overlayTopIndex = i;
      } else if (field.name === 'left' && field.type === 'number') {
        indexes.overlayLeftIndex = i
      } else if (field.name === 'width' && field.type === 'number') {
        indexes.overlayWidthIndex = i
      } else if (field.name === 'height' && field.type === 'number') {
        indexes.overlayHeightIndex = i;
      }
    }

    const rowLength = this.props.data.series[0].length;
    const rowData = new Array(rowLength);

    //if (indexes.imageIndex === -1) {
    if ( rowLength == 0 ) {
      return (
        <div style={{ textAlign: 'center', lineHeight: this.props.height+'px', fontSize: '17px', color: '#ffff00' }}>
          There are no images to be displayed for the selected time range
        </div>
      )
    }

    //Error handling while traversing images data and setting up the data structure
    try {
      for (let rowIdx: number = 0; rowIdx < rowLength; ++rowIdx) {
        rowData[rowIdx] = this.renderItemFromRow(rowIdx, indexes)
      }
    }
    catch (error) {
      return (
        <div style={{ overflow: 'scroll', width: this.props.width, height: this.props.height }}>
          <div style={{ textAlign: 'left', fontSize: '16px', color: '#ff0000' }}>
            An error occurred. 
            <br/><br/>
            <strong>Details:</strong> Data fetched successfully but error occurred during rendering data into the panel
            <br/>
            <strong>Cause:</strong> {error.message}
          </div>
        </div>
      )
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
