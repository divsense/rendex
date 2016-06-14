
export default function( model, templates, root ){

    let data = {
        id: root,
        context: 'init',
        options:{},
        model,
        renderNode
    }

	return IO( R.always( data ) ).map( renderNode )

}

