import * as R from "ramda"
import renderNode from "./renderNode.js"

export default function renderBranch({id, node, context, model, templates, options}) {

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
			options = R.merge( options || {}, link.options );
		}
        renderNode( {id:link.id, context, model, templates, options} );
    });
}



