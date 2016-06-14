export default function renderNode({id, context, model, templates, options}) {

    const node = model.get( id );

    context = node.context || context;

    const renderContext = node.render[ context ];

	if( renderContext ){

		const templateFunc = templates[ renderContext.template ];

		templateFunc.call( null, {id, node, context, model, templates, options} );

	}

}

