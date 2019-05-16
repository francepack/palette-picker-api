# Palette-picker API
This API holds user data regarding palettes for projects. This API is used for the palette-pick application found here: [Palette-picker](https://github.com/TomWilhoit/palette-picker).

### Deployment
[palette-picker api on heroku](https://palette-api-tm.herokuapp.com/)

### Created by
[Mason France](https://github.com/francepack)
[Tom Wilhoit](https://github.com/TomWilhoit)

# API calls
## GET
### GET **/api/v1/projects**
Get all projects from database.

**Example Response:**
```
[
  {
    "id": 1,
    "name": "Sweet Project",
    "created_at": "2019-05-01T01:28:48.218Z",
    "updated_at": "2019-05-01T01:28:48.218Z"
  },
  {
    "id": 2,
    "name": "Best Project Ever",
    "created_at": "2019-05-01T01:28:48.226Z",
    "updated_at": "2019-05-01T01:28:48.226Z"
  },
  {
    "id": 3,
    "name": "ok_project",
    "created_at": "2019-05-01T01:28:48.237Z",
    "updated_at": "2019-05-01T01:28:48.237Z"
  }
]
```

### GET **/api/v1/palettes**
Get all palettes from database.

**Example Response:**
```
[
  {
    "id": 10,
    "name": "My Color Palette",
    "color1": "33812B",
    "color2": "A0B09E",
    "color3": "39D8B4",
    "color4": "9D27AB",
    "color5": "652B81",
    "project_id": "2",
    "created_at": "2019-05-01T01:28:48.218Z",
    "updated_at": "2019-05-01T01:28:48.218Z"
  },
  {
    "id": 11,
    "name": "Candy colors",
    "color1": "33812B",
    "color2": "A0B09E",
    "color3": "39D8B4",
    "color4": "9D27AB",
    "color5": "652B81",
    "project_id": "3",
    "created_at": "2019-05-01T01:28:48.226Z",
    "updated_at": "2019-05-01T01:28:48.226Z"
  },
  {
    "id": 12,
    "name": "Ocean colors",
    "color1": "33812B",
    "color2": "A0B09E",
    "color3": "39D8B4",
    "color4": "9D27AB",
    "color5": "652B81",
    "project_id": "1",
    "created_at": "2019-05-01T01:28:48.237Z",
    "updated_at": "2019-05-01T01:28:48.237Z"
  }
]
```
#### Optional query, get palette by name

**Example Request**

```
/api/v1/palettes?name=PALETTE_NAME_HERE
```

**Example Response**
```
{
    "id": 12,
    "name": "PALETTE_NAME_HERE",
    "color1": "33812B",
    "color2": "A0B09E",
    "color3": "39D8B4",
    "color4": "9D27AB",
    "color5": "652B81",
    "project_id": 2,
    "created_at": "2019-05-11T22:07:04.988Z",
    "updated_at": "2019-05-11T22:07:04.988Z"
}
```


### GET **/api/v1/projects/:id**
Get a particular project by id from database.

**Example Response:**
```
  {
    "id": 2,
    "name": "Best Project Ever",
    "created_at": "2019-05-01T01:28:48.226Z",
    "updated_at": "2019-05-01T01:28:48.226Z"
  }
```

### GET **/api/v1/palettes/:id**
Get a particular palette by id from database.

**Example Response:**
```
{
    "id": 10,
    "name": "My Color Palette",
    "color1": "33812B",
    "color2": "A0B09E",
    "color3": "39D8B4",
    "color4": "9D27AB",
    "color5": "652B81",
    "project_id": "3",
    "created_at": "2019-05-01T01:28:48.218Z",
    "updated_at": "2019-05-01T01:28:48.218Z"
}
  ```

### GET **/api/v1/projects/:id/palettes**
Get all palettes of a particular project by id from database.

**Example Response:**
```
[
  {
    "id": 10,
    "name": "My Color Palette",
    "color1": "33812B",
    "color2": "A0B09E",
    "color3": "39D8B4",
    "color4": "9D27AB",
    "color5": "652B81",
    "project_id": "3",
    "created_at": "2019-05-01T01:28:48.218Z",
    "updated_at": "2019-05-01T01:28:48.218Z"
  },
  {
    "id": 11,
    "name": "Candy colors",
    "color1": "33812B",
    "color2": "A0B09E",
    "color3": "39D8B4",
    "color4": "9D27AB",
    "color5": "652B81",
    "project_id": "3",
    "created_at": "2019-05-01T01:28:48.226Z",
    "updated_at": "2019-05-01T01:28:48.226Z"
  },
  {
    "id": 12,
    "name": "Ocean colors",
    "color1": "33812B",
    "color2": "A0B09E",
    "color3": "39D8B4",
    "color4": "9D27AB",
    "color5": "652B81",
    "project_id": "3",
    "created_at": "2019-05-01T01:28:48.237Z",
    "updated_at": "2019-05-01T01:28:48.237Z"
  }
]
```

## POST
### POST **/api/v1/projects**
Add a new project.

**Required Request Body Input**

| Key Name | Data Type | Description |
| ---- | :----: | ---- |
| **name** | `string` | Name of your project |

**Example Request Body:**
```
{
  "name": "My Best project yet"
}
```

**Example Response:**

```
{
  "id": 23
}
```

### POST **/api/v1/projects/:id/palettes**
Add a palette to a particular project by id. To post a palette, there must be an associated project at the id included in url.

**Request-Body Input Description**

| Key Name | Data Type | Description |
| ---- | :----: | ---- |
| **name** | `string` | Name of color palette |
| **color1** | `string` | First hex code |
| **color2** | `string` | Second hex code |
| **color3** | `string` | Third hex code |
| **color4** | `string` | Fourth hex code |
| **color5** | `string` | Fifth hex code |

**Example Request:**
```
{
  "name": "Mason France",
  "color1": "33812B",
  "color2": "A0B09E",
  "color3": "39D8B4",
  "color4": "9D27AB",
  "color5": "652B81",
}
```

**Example Response:**

```
{
  "id": 53
}
```

## PUT
### PUT **/api/v1/projects/:id**
Revise a particular project by id.

**Required Request Body Input**

| Key Name | Data Type | Description |
| ---- | :----: | ---- |
| **name** | `string` | Name of your project |

**Example Request Body:**
```
{
  "name": "Time for a name change"
}
```

**Example Response:**

```
Project ID 23 has been updated
```

### PUT **/api/v1/palettes/:id**
Revise a particular palette by id.

**Request-Body Input Description**

| Key Name | Data Type | Description |
| ---- | :----: | ---- |
| **name** | `string` | Name of color palette |
| **color1** | `string` | First hex code |
| **color2** | `string` | Second hex code |
| **color3** | `string` | Third hex code |
| **color4** | `string` | Fourth hex code |
| **color5** | `string` | Fifth hex code |

**Example Request:**
```
{
  "name": "New palette",
  "color1": "33812B",
  "color2": "A0B09E",
  "color3": "39D8B4",
  "color4": "9D27AB",
  "color5": "652B81",
}
```

**Example Response:**

```
{
  Palette ID 42 has been updated
}
```

## DELETE
### DELETE **/api/v1/projects/:id**
Delete a project.

**Warning: This will delete all palettes associated with project**

**Example Response:**
```
  Successful deletion of project id 12 and all associated palettes
```

### DELETE **/api/v1/palettes/:id**
Delete a palette.

**Example Response:**
```
  Successful deletion of palette id 33
```
