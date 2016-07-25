# rendex
```
render :: Model -> renderNode -> Template -> renderBranch -> render
```

## Usage
```javascript
import Immutable from "immutable"
import {patch, elementOpen, elementClose} from "incremental-dom"
import Rendex from "rendex"

const $model = Immutable.Map({
  'root':{
    render:{
      template:'rootTmpl'
    },
    branch:[ {id: 'node1'}, {id: 'node2'} ]
  }, 
  'node1':{
    content:'Hello, ',
    render:{
      template:'nodeTmpl'
    }
  }, 
  'node2':{
    content:'World!',
    render:{
      template:'nodeTmpl'
    }
  }
});

const rootTmpl = data => {
  elementOpen('p')
    Rendex.renderBranch(data)
  elementClose('p')
}

const nodeTmpl = data => {
  elementOpen('span')
    text( data.$node.content )
  elementClose('span')
}

const $templates = { rootTmpl, nodeTmpl }

const data = {$id: 'root', $templates, $model}

const render = () => patch( document.body, Rendex.renderNode, data )


```

## Description

###Model
A set of interconnected __nodes__

###Node
Terminal | Branch

###Terminal
A __node__ with at least one property __render__.  
May have optional __context__ property.  

```javascript
{
  context: "...", /* optional */
  render: {...}
}
```

###Branch
A __node__ with at least two properties __render__ and __branch__  
May have optional __context__ property.  
```javascript
{
  context: "...", /* optional */
  render: {...},
  branch: [{...}, ...]
}
```

###render
contextless | contextual | complex

###contextless render
An object with at least one property __template__.
May contain properties __render::branch__ and/or __options__.  

```javascript
{
  render: {
    template: "...",
    branch:{ ...}, /* optional */
    options:{ ...}, /* optional */
  }
}
```

###contextual render
An object with at least one property __context__.  
__context__ may contain one or more named contextless __render__ objects.

```javascript
{
  render: {
    context:{
      "my-context-1":{
        template: "...",
        branch: { ... }, /* optional */
        options:{ ... }  /* optional */
      },
      myContext2:{ ... }
  }
}
```

###complex render
A combination of contextual __render__ and contextless __render__

```javascript
{
  render: {
    template: "...",
    branch:{ ...}, /* optional */
    options:{ ...}, /* optional */
    context:{
      "my-context-1":{
        template: "...",
        branch: { ... }, /* optional */
        options:{ ... }  /* optional */
      },
      myContext2:{ ... }
  }
}
```

###render::branch
A fine-tuning of __branch__ rendering.  
May contain optional properties __render::branch::show__, __render::branch::hide__ or __render::branch::options__.

```javascript
{
  render: {
    template: "...",
    branch:{
      show: { ... },
      hide: { ... },
      options: { ... }
  }
}
```
###branch
Defines parent-child relation with other __nodes__.  

```javascript
{
  branch: [
    {
      id: "...",
      options: { ... }, /* optional */
      context: "..."    /* optional */
    },
    {
      id: "..."
    }
  ]
}
```
###Template
```javascript
const myTemplate = ({$id, $node, $context, $options, $model, $templates, $index}){
  ...
  Rendex.renderBranch({$id, $node, $context, $options, $model, $templates})
  ...
  Rendex.renderSection({$id, $node, $context, $options, $model, $templates}, start, end )
  ...
}
```

