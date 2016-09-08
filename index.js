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
            var pval = _path( path.slice(), obj );
			return (typeof pval === 'undefined' || pval === value);
        }
        throw("Invalid 'path' property");
    }
}

var _extend = function (obj, src) {
	return Object.assign({}, obj, src );
}

var _isActive = function(x){return x.active}

var _filterShow = function( show, items){
	return show ?  items.filter(_pathEq(show.path, show.value)) : items;
}

var _makeOption = function(name, value){
	var obj = {};
	obj[ name ] = value;
	return obj;
}

var _nodeContent = function(m,a){ 
	return m && m[ a ] 
}

var _extendRuntimeRefOptions = function(obj, src, model){

	return src.reduce( function(m,a){

		if( a.id ){
			var node = model.get( a.id );
			if( node ){
				if( a.path ){
					return _extend( m, _makeOption(a.name, a.path.reduce(_nodeContent, node) ));
				}
				else{
					return _extend( m, _makeOption(a.name, node ));
				}
			}
			throw("Runtime options error. Node '" + a.id +"' not found");
		}
        return m;

	}, obj);

}

var _extendRuntimeFuncOptions = function(obj, src, data, func){

	return src.reduce( function(m,a){

		if( a.func ){
			var fn = func[ a.func ];
			if( fn ){
				return _extend( m, _makeOption(a.name, fn.call(null, data, a.params)) );
			}
			throw("Runtime options error. Function '" + a.func +"' not found");
		}
        return m;

	}, obj);

}

var renderTemplate = function(data, tmpl){

    var templateFunc = data.$templates[ tmpl ];

	if(!templateFunc){
		throw( data.$id + ": template '" + tmpl + "' not found" );
	}

	templateFunc.call( null, data );
}

var renderNode = function(data, template){

    var $id        = data.$id;
    var $context   = data.$context;
    var $model     = data.$model;
    var $templates = data.$templates;
    var $options   = data.$options;
    var $index     = data.$index;
    var $parent    = data.$parent;
    var $siblings  = data.$siblings;
    var $functions  = data.$functions;

    var $node = $model.get( $id );
    $context = $node.context || $context;

    if( $node.render || template ){

        var tmpl;

        if( $node.render ) {

            if( $node.render.options ){
                $options = _extend( $options, $node.render.options );
            }

            if( $node.render.runtime && $node.render.runtime.options ){
                $options = _extendRuntimeRefOptions( $options, $node.render.runtime.options, $model );
                $options = _extendRuntimeFuncOptions( $options, $node.render.runtime.options, {$id,$model,$options,$index,$parent,$siblings}, $functions  );
            }

            var ctx = _getContext($node, $context);

            if( ctx.options ){
                $options = _extend( $options, ctx.options );
            }

            if( ctx.runtime && ctx.runtime.options ){
                $options = _extendRuntimeRefOptions( $options, ctx.runtime.options, $model );
                $options = _extendRuntimeFuncOptions( $options, ctx.runtime.options, {$id,$model,$options,$index,$parent,$siblings}, $functions  );
            }

            tmpl = ctx.template;
        }

		tmpl = template || tmpl;

		if( !tmpl ){
			throw("Undefined template for context '" + $context + "' in '" + $id + "'" );
		}

		var _data = {

            $id:        $id,
            $node:      $node,
            $context:   $context,
            $model:     $model,
            $templates: $templates,
			$functions: $functions,
            $options:   $options,
			$parent:    $parent,
            $siblings:  $siblings,
            $index:     $index

        };

		renderTemplate( _data, tmpl );
    }

}

var renderBranch = function(data, branchname, range, filter){

    var $id          = data.$id;
    var $node        = data.$node;
    var $context     = data.$context;
    var $model       = data.$model;
    var $templates   = data.$templates;
    var $options     = data.$options;
    var $functions   = data.$functions;
    var $index     = data.$index;
    var $parent    = data.$parent;
    var $siblings  = data.$siblings;

    if( !$node.branch ){
        return;
    }

    var bx = Array.isArray($node.branch) ? $node.branch : $node.branch[ branchname ];

    if( !bx ){
        return;
    }

    var ctx = _getContext($node, $context);

	var branch, template, func;

	if( ctx.branchByName && ctx.branchByName[ branchname ] ){

		branch = ctx.branchByName[ branchname ];

		var swallow = (branch.swallow || []).find(_isActive);

		if( swallow ){
			bx = [swallow];
			branch = null;
		}
		else{

			var skipTo = (branch.skipTo || []).filter(_isActive);

			if( skipTo.length ){
				bx = skipTo;
				branch = null;
			}
		}
	}
	else{
		branch = ctx.branch;
	}

    if( branch ){

		bx = _filterShow( branch.show, bx );

		if( branch.options ){
			$options = _extend( $options, branch.options );
		}

		if( branch.runtime && branch.runtime.options ){
			$options = _extendRuntimeRefOptions( $options, branch.runtime.options, $model );
            $options = _extendRuntimeFuncOptions( $options, branch.runtime.options, {$id,$model,$options,$index,$parent,$siblings}, $functions  );
		}

        template = branch.template;
    }

    bx.forEach( (item, index) => {
		
		if( !range || (index >= range[0] && index < range[1]) ){

            var _options = $options;

			if( item.options ){
				_options = _extend( $options, item.options );
			}

			if( item.runtime && item.runtime.options ){
				_options = _extendRuntimeRefOptions( $options, item.runtime.options, $model );
                _options = _extendRuntimeFuncOptions( $options, item.runtime.options, {$id,$model,$options,$index,$parent,$siblings}, $functions  );
			}

			var _context = item.context || $context;

			var _data = {
				$id:        item.id,
				$context:   _context,
				$model:     $model,
				$templates: $templates,
				$functions: $functions,
				$options:   _options,
				$parent:    $node,
				$siblings:  bx,
				$index:     index
			};

			if( filter ){
				func = $functions[ filter ];
				if( !func ){
					throw("Undefined function '"+ filter + "'");
				}
			}

			if( !filter || func(_data) ){
				renderNode(_data, template);
			}
		}

    });
}

var render = function(d){

	var node = d.model.get(d.id);

	var data = {
		$id:        d.id,
		$context:   d.context,
		$model:     d.model,
		$templates: d.templates,
        $options:   d.options || {},
        $functions: d.functions || {},
		$parent:    null,
		$siblings:  [],
		$index:     0
	};

	renderNode( data );

}

exports.renderTemplate = renderTemplate;
exports.renderNode = renderNode;
exports.renderBranch = renderBranch;
exports.render = render;

