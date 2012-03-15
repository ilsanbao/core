apibrowser.callback({
  "statics": [
    {
      "constant": true, 
      "name": "SUPPORTS_PARALLEL", 
      "doc": "<p>Whether the loader supports parallel requests. Always true for images.</p>\n", 
      "value": "true", 
      "summary": "Whether the loader supports parallel requests.", 
      "visibility": "public", 
      "sourceLink": "source:core.io.Image~19", 
      "line": 19, 
      "type": "Boolean"
    }, 
    {
      "name": "load", 
      "doc": "<p>Loads an image with the given <code class=\"param\">uri</code> and fires a <code class=\"param\">callback</code> (in <code class=\"param\">context</code>) when the image was loaded.\nOptionally appends an random <code>GET</code> parameter to omit caching when <code class=\"param\">nocache</code> is enabled.</p>\n", 
      "visibility": "public", 
      "summary": "Loads an image with the given uri and fires a callback (in context) when the image was loaded.", 
      "params": [
        {
          "position": 0, 
          "type": [
            {
              "linkable": true, 
              "builtin": true, 
              "name": "String"
            }
          ], 
          "name": "uri"
        }, 
        {
          "position": 1, 
          "type": [
            {
              "linkable": true, 
              "builtin": true, 
              "name": "Function"
            }
          ], 
          "name": "callback"
        }, 
        {
          "position": 2, 
          "optional": true, 
          "name": "context", 
          "type": [
            {
              "linkable": true, 
              "builtin": true, 
              "name": "Object"
            }
          ]
        }, 
        {
          "default": "false", 
          "position": 3, 
          "optional": true, 
          "name": "nocache", 
          "type": [
            {
              "builtin": true, 
              "name": "Boolean"
            }
          ]
        }
      ], 
      "sourceLink": "source:core.io.Image~25", 
      "line": 25, 
      "type": "Function", 
      "isFunction": true
    }
  ], 
  "assets": [], 
  "package": "core.io", 
  "basename": "Image", 
  "permutations": [
    "debug"
  ], 
  "uses": [
    "core.Assert", 
    "core.Env", 
    "core.Module"
  ], 
  "usedBy": [
    "core.io.Queue"
  ], 
  "main": {
    "name": "core.io.Image", 
    "tags": [], 
    "doc": "<p>Image loader with support for load callback.</p>\n", 
    "summary": "Image loader with support for load callback.", 
    "line": 16, 
    "type": "core.Module"
  }, 
  "id": "core.io.Image", 
  "size": {
    "zipped": 243, 
    "optimized": 343, 
    "compressed": 850
  }
},'core.io.Image');