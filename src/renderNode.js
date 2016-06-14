import * as R from "ramda"

export default function renderNode({id, context, model, templates, options}) {

    const node = R.view( R.lensProp( id ), model );

    context = node.context || context;

    const renderContext = node.render[ context ];

	if( renderContext ){

		const templateFunc = templates[ renderContext.template ];

		templateFunc.call( null, {id, node, context, model, templates, options} );

	}

}

