# Grafana Custom plugin - Images

Grafana Custom Plugin to display Blob images from the data store in Panel with text support.

It also has a feature to display an overaly over the images to highlight certain area based on the given dimensions/coordinates.

Image size can be resized keeping pixels resolution uniform. Image resolution uniformity also works for overylay resizing.

This plugin provides following configuration settings:
* Image Size
* Text Font Size
* Overlay Stroke Size (Line thickness)
* Color settings for Image Border
* Color settings for Overlay Stroke

## Usage

1. Download ”Com2u - Images” panel from the Com2u GitHub
2. Add it to the Grafana/../grafana-<version>/data/plugins/
3. Restart Grafana Server
4. The custom plugin appears on the Grafana under Installed Plugins
5. Add new Dashboard, select 'Images' plugins as visualization in the panel (click the panel title to go to the edit page)
6. Write a Query for displaying data in panel
7. Configure vizualization options

### Sample query
```sql
SELECT
  timestamp AT TIME ZONE 'MEZ-1h' as time,
  random()*100 as value1,
  random()*100 as value2,
  triggerindex as label,
  timestamp,
  result1 as top, result2 as left, result3 as width, result1 as height,
  encode(image1, 'base64') as image,
  revolution
FROM
  trigger
WHERE
  $__timeFilter(timestamp) 
LIMIT 40
```

### For Development Purposes only
1. Run `npm install` to install the dependencies
2. Run `npm run start` to run the plugin in watch mode
3. Run `npm run build` to create the build and generate Plugins distributable. These builds get generated in 'dist' folder.