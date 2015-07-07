const jsdom = require( 'jsdom' ),
	_ = require( 'lodash' );

const buildDom = function ( html ) {
	return new Promise(
		function ( resolve, reject ) {
			jsdom.env( html, function ( error, window ) {
					error ? reject( error ) : resolve( window );
				}
			)
		}
	)
};

const parseVote = function ( votingItem ) {
	"use strict";

	let deputy = votingItem.firstElementChild.innerHTML,
		vote = votingItem.lastElementChild.innerHTML.replace( /<.+?>(.*?)<\/.+?>/g, '$1' ).replace( /\*/, '' );
	return {deputy: deputy, vote: vote};
};

const calculateSummary = function ( groupedResults ) {
	"use strict";

	return _.map( groupedResults, function ( group, groupName ) {
		let result = {};
		result[groupName] = group.length;
		return result;
	} )
};

const groupByVote = function ( results ) {
	"use strict";

	let groupedResults = {};
	const voteMap = {
		noVote   : ['не голосував', 'не голосувала'],
		no       : ['проти'],
		yes      : ['за'],
		absent   : ['відсутній', 'відсутня'],
		abstained: ['утримався', 'утрималась']
	};

	const filterByVote = function ( results, voteType ) {
		return _.filter( results, function ( resultItem ) {
			return voteMap[voteType].indexOf( resultItem.vote.toLowerCase() ) !== -1;
		} );
	};

	groupedResults.noVote = filterByVote( results, 'noVote' );
	groupedResults.no = filterByVote( results, 'no' );
	groupedResults.yes = filterByVote( results, 'yes' );
	groupedResults.absent = filterByVote( results, 'absent' );
	groupedResults.abstained = filterByVote( results, 'abstained' );

	return groupedResults;
};

module.exports = {
	parseVotingResult: function ( votingPage ) {
		"use strict";

		let self = this;
		const voteItemSelector = '.frd li';

		buildDom( votingPage ).then(
			function ( window ) {
				console.log( 'HTML parsed' );
				let block = window.document.getElementById( '00' ),
					items,
					results = [],
					summary;

				if ( block ) {
					console.log( 'Block with table found' );
					items = block.querySelectorAll( voteItemSelector );
					console.log( `Found ${items.length} record(s) in block` );

					for ( let i = 0, length = items.length; i < length; i++ ) {
						results.push( parseVote( items[i] ) );
					}

					let grouped = groupByVote( results );

					summary = calculateSummary( grouped );
					console.log( summary );
				} else {
					console.error( 'Can\'t find block with voting table' );
				}
			},
			function ( error ) {
				console.error( `HTML parsing error! ${error.text}` )
			}
		);
	},

	parseProjectsList: function ( projectsListPage ) { // TODO

	},

	parseProgectPage: function ( projectPage ) { // TODO

	}
};