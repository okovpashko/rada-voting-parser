"use strict";
//require( "babel/register" );

var request = require( './request.js' );
var parseVotingResult = require( './parser.js' ).parseVotingResult;

const url = 'http://w1.c1.rada.gov.ua/pls/radan_gs09/ns_golos?g_id=3049';
//const url = 'http://w1.c1.rada.gov.ua/pls/radan_gs09/ns_golos?g_id=2932';

request.fetchPage( url ).then(
	function ( pageHtml ) {
		console.log( 'Page retrieved. Parsing...' );
		parseVotingResult( pageHtml );
	},
	function ( error ) {
		console.log( error );
	}
);