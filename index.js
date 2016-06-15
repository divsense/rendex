var Immutable = require("immutable")

var renderNode = function({id, context, model, templates, options}) {

    const node = model.get( id );

    context = node.context || context;

    const renderContext = node.render[ context ];

	if( renderContext ){

		var data = {id, node, context, model, templates, options};

		const templateOpen = templates[ renderContext.template[0] ];

		templateOpen.call( null, data);

		if( renderContext.template[1] ){

			renderBranch( data );

			templates[ renderContext.template[1] ].call( null, data );
		}

	}
}

var renderBranch = function({id, node, context, model, templates, options}) {

    let branch = node.branch || [];

    const renderContext = node.render[ context ];

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

    branch.forEach( link => {
		if( link.options ){
			options = Object.assign( options || {}, link.options );
		}
		renderNode( {id:link.id, context, model, templates, options} );
    });
}

module.exports = function(model_, templates_, id_){

	var model = Immutable.Map( model_ );
	var templates = templates_;
	var id = id_;

	function render( ){
		renderNode( {id, model, templates} );
	}

	function update( cb, isRendering ){
		model = cb( model );
		if( isRendering ){
			render();
		}
	}

	return {
		render,
		update,
		toJS: function(){ return model.toObject() }
	}
}
