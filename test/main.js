import test from 'ava'
import initModel from "../index.js"

test(t => {

	let Result = "";

	const mainA_ = data => {

		Result += `<div id='${ data.id }'>`;

		Result += '<p>' + data.node.text + '</p>';

		Result += '<ul>';
	}

	const _mainA = () => {

		Result += '</ul>';

		Result += '</div>';

	}

	const mainX = data => {

		Result += `<li class='${ data.options.side }'>`;

		Result += data.node.text;

		Result += '</li>';

	}

	let m = {

		'a': {
			text: 'A:',
			context: 'main',
			render:{
				main:{
					template: ['mainA_', '_mainA']
				}
			},
			branch:[
			{id: 'b', options:{side:'left'}},
			{id: 'c', options:{side:'right'}}
			]
		},

		'b': {
			text: 'b',
			render:{
				main:{
					template: ['mainX']
				}
			},
		},

		'c': {
			text: 'c',
			render:{
				main:{
					template: ['mainX']
				}
			}
		}
	};

	const templates = {
		mainA_,_mainA,
		mainX
	}

	let model = initModel( m, templates, 'a' );

	const sample = "<div id='a'><p>A:</p><ul><li class='left'>b</li><li class='right'>c</li></ul></div>";

	model.render();

	t.is( sample, Result );

})

