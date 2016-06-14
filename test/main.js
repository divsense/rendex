import test from 'ava'
import {renderNode, renderBranch} from "../index.js"

test(t => {

	let Result = "";

	const mainA = data => {

		let {id, node, context, options, model, templates} = data;

		Result += `<div id='${ id }'>`;

		Result += '<p>' + node.text + '</p>';

		Result += '<ul>';

		renderBranch( { id, node, context, model, templates, options } );

		Result += '</ul>';

		Result += '</div>';

	}

	const mainX = data => {

		Result += `<li class='${ data.options.side }'>`;

		Result += data.node.text;

		Result += '</li>';


	}

	let model = new Map([

		['a', {
			text: 'A:',
			context: 'main',
			render:{
				main:{
					template: 'mainA'
				}
			},
			branch:[
			{id: 'b', options:{side:'left'}},
			{id: 'c', options:{side:'right'}}
			]
		}],

		['b', {
			text: 'b',
			render:{
				main:{
					template: 'mainX'
				}
			},
		}],

		['c', {
			text: 'c',
			render:{
				main:{
					template: 'mainX'
				}
			}
		}]
	]);

	const templates = {
		mainA,
		mainX
	}

	renderNode( {id: 'a', model, templates} );

	const sample = "<div id='a'><p>A:</p><ul><li class='left'>b</li><li class='right'>c</li></ul></div>";

	t.is( sample, Result );


})

