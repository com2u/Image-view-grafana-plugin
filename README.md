# Images plugin

You can display blob images from a database using this plugin.

# Usage

1. Download and install plugin
2. Restart Grafana server
3. Add the panel to your dashboard
4. Write a query for your database. Example:
```sql
SELECT
  encode(blobImage, 'base64') as image,
  textField as label,
  random()*100 as value
FROM
  tableWithBlobImages
LIMIT 10
```
5. Configure vizualization options