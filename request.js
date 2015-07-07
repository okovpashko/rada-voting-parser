const fixHtmlValidity = function ( pageHtml ) {
	return pageHtml.replace( /(<.+)html"/, '$1html' );
};

module.exports = {
	fetchPage: function ( pageURL ) {
		"use strict";

		const request = require( 'request' );
		const iconv = require( 'iconv-lite' ),
			requestOptions = {url: pageURL, encoding: 'win-1251'};

		iconv.extendNodeEncodings(); // for win-1251 support

		return new Promise( function ( resolve, reject ) {
				request.get( requestOptions,
					function ( error, response ) {
						if ( error ) {
							reject( error );
						}

						if ( response.statusCode === 200 ) {
							resolve( fixHtmlValidity( response.body ) );
						}
					}
				)
			}
		);
	}
};
