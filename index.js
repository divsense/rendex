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

var renderNode = function(data){

    var $id        = data.$id;
    var $context   = data.$context;
    var $model     = data.$model;
    var $templates = data.$templates;
    var $options   = data.$options;
    var $index     = data.$index;

    var $node = $model.get( $id );
    $context = $node.context || $context;

    if( $node.render ){

        var ctx = _getContext($node, $context);

        if( ctx.options ){
            $options = Object.assign( $options || {}, ctx.options );
        }

        if( !ctx.template ){
            throw("Undefined template for context '" + $context + "' in '" + $id + "'" );
        }

        var templateFunc = $templates[ ctx.template ];

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

    if( !$node.branch ){
        return;
    }

    var bx = $node.branch;

    var ctx = _getContext($node, $context);

    var show = ctx.branch && ctx.branch.show;

    if( show ){
        bx = bx.filter(_pathEq(show.path, show.value));
    }

    bx.forEach( (item, index) => {

		if( item.options ){
			$options = Object.assign( $options || {}, item.options );
		}

        $context = item.context || $context;
		
		renderNode({
            $id:        item.id,
            $context:   $context,
            $model:     $model,
            $templates: $templates,
            $options:   $options,
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

    if( !$node.branch ){
        return;
    }

    for( var i = start; i < end; i++ ){

        var item = $node.branch[ i ];

        if( !item ){
            break;
        }

		if( item.options ){
			$options = Object.assign( $options || {}, item.options );
		}

		renderNode({
            $id:        item.id,
            $context:   item.context || $context,
            $model:     $model,
            $templates: $templates,
            $options:   $options,
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
		$context:   d.context
	};

	renderNode( data );

}

exports.renderNode = renderNode;
exports.renderBranch = renderBranch;
exports.renderSection = renderSection;
exports.render = render;

