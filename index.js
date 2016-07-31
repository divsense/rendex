'use strict';

var _getContext = function(node,context){
    return (node.render.context && node.render.context[context]) ?
            node.render.context[context] : node.render;
}

var _path = function(path, obj){
    if( path.length === 1 ){
        return obj[ path[0] ];
    }
    var prop = path.shift();
    return _path( path, obj[prop] );
}

var _pathEq = function(path, value){
    return function(obj){
        if( Array.isArray(path) && path.length > 0 ){
            return _path( path.slice(), obj ) === value;
        }
        throw("Invalid 'path' property");
    }
}

var _extend = function (obj, src) {
      return Object.assign({}, obj, src );
}

var renderNode = function(data){

    var $id        = data.$id;
    var $context   = data.$context;
    var $model     = data.$model;
    var $templates = data.$templates;
    var $options   = data.$options;
    var $index     = data.$index;
    var $template  = data.$template;

    var $node = $model.get( $id );
    $context = $node.context || $context;

    var templateFunc;

    if( $node.render || $template ){

        var tmpl;

        if( $node.render ){

            if( $node.render.options ){
                $options = _extend( $options, $node.render.options );
            }

            var ctx = _getContext($node, $context);

            if( ctx.options ){
                $options = _extend( $options, ctx.options );
            }

            if( !ctx.template ){
                throw("Undefined template for context '" + $context + "' in '" + $id + "'" );
            }

            tmpl = ctx.template;

        }
        else{
            tmpl = $template;
        }

        templateFunc = $templates[ tmpl ];

        if(!templateFunc){
            throw("Template '" + ctx.template + "' not found" );
        }

        templateFunc.call( null, {
            $id:        $id,
            $node:      $node,
            $context:   $context,
            $model:     $model,
            $templates: $templates,
            $options:   $options,
            $index:     $index
        });
    }

}

var renderBranch = function(data){

    var $id        = data.$id;
    var $node      = data.$node;
    var $context   = data.$context;
    var $model     = data.$model;
    var $templates = data.$templates;
    var $options   = data.$options;
    var $branchname    = data.$branchname;
    var $template;

    if( !$node.branch ){
        return;
    }

    var bx = Array.isArray($node.branch) ? $node.branch : $node.branch[ $branchname ];

    var ctx = _getContext($node, $context);

    if( ctx.branch ){

        var show = ctx.branch.show;

        if( show && ( !show.name || show.name === $branchname) ){
            bx = bx.filter(_pathEq(show.path, show.value));
        }

        $template = ctx.branch.template;

    }

    bx.forEach( (item, index) => {

		if( item.options ){
			$options = _extend( $options, item.options );
		}

        $context = item.context || $context;
		
		renderNode({
            $id:        item.id,
            $context:   $context,
            $model:     $model,
            $templates: $templates,
            $options:   $options,
            $template:  $template,
            $index:     index
        });

    });
}

var renderSection = function(data, start, end){

    var $id        = data.$id;
    var $node      = data.$node;
    var $context   = data.$context;
    var $model     = data.$model;
    var $templates = data.$templates;
    var $options   = data.$options;
    var $branchname    = data.$branchname;
    var $template;

    if( !$node.branch ){
        return;
    }

    var ctx = _getContext($node, $context);

    var bx = Array.isArray($node.branch) ? $node.branch : $node.branch[ $branchname ];

    if( ctx.branch ){

        var show = ctx.branch.show;

        if( show && ( !show.name || show.name === $branchname) ){
            bx = bx.filter(_pathEq(show.path, show.value));
        }

        $template = ctx.branch.template;

    }

    for( var i = start; i < end; i++ ){

        var item = bx[ i ];

        if( !item ){
            break;
        }

		if( item.options ){
			$options = _extend( $options, item.options );
		}

		renderNode({
            $id:        item.id,
            $context:   item.context || $context,
            $model:     $model,
            $templates: $templates,
            $options:   $options,
            $template:  $template,
            $index:     i
        });
    }

}

var render = function(d){

	var node = d.model.get(d.id);

	var data = {
		$id:        d.id,
		$node:      node,
		$model:     d.model,
		$templates: d.templates,
		$context:   d.context,
        $options:   {}

	};

	renderNode( data );

}

exports.renderNode = renderNode;
exports.renderBranch = renderBranch;
exports.renderSection = renderSection;
exports.render = render;

