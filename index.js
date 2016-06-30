var renderNode = function({$id, $context, $model, $templates, $options, $index}) {

    const $node = $model.get( $id );
    $context = $node.context || $context;
    const renderContext = $node.render[ $context ];

	if( renderContext ){
		var data = {$id, $node, $context, $model, $templates, $options, $index};
		const templateFunc = $templates[ renderContext.template ];
		templateFunc.call( null, data);
	}
}

var renderBranch = function({$id, $node, $context, $model, $templates, $options}){

    let branch = $node.branch || [];

    const renderContext = $node.render[ $context ];

    const branchContext = renderContext.branch || {};

	if( branchContext.append ){
		branch = branch.concat( branchContext.append );
	}

	if( branchContext.prepend ){
		branch = branchContext.prepend.concat( branch );
	}

	if( branchContext.replace ){
		branch = branchContext.replace;
	}

	if( branchContext.link ){
		branch = $model.get( branchContext.link ).branch;
	}

    branch.forEach( (item, $index) => {
		if( item.options ){
			$options = Object.assign( $options || {}, item.options );
		}
		var data = {$id:item.id, $context, $model, $templates, $options, $index};
		renderNode( data );
    });
}

var render = function(d){

	var node = d.model.get(d.id);

	var data = {
		$id:d.id,
		$node: node,
		$model: d.model,
		$templates: d.templates,
		$context: d.context
	};

	renderNode( data );

}

exports.renderNode = renderNode;
exports.renderBranch = renderBranch;
exports.render = render;

