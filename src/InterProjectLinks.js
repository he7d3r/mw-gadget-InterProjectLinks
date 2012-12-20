/** Adiciona ligações para os correlatos na barra lateral ([[MediaZilla:708]])
 * Adiciona links para os correlatos informados com [[Template:Correlatos]],
 * nas páginas especiais e nas mensagens do MediaWiki
 * @see [[wikt:de:MediaWiki:Onlyifsystem.js]]
 * @see [[commons:MediaWiki:InterProject.js]]
 * @see [[MediaWiki:Common.js]]
 * @author [[wikt:de:Melancholie]]
 * @author [[wikt:de:Pill]]
 * @author [[wikt:de:Spacebirdy]]
 * @author [[wikt:de:Balû]]
 * @author [[commons:User:Ilmari Karonen]]
 * @author [[commons:User:DieBuche]]
 * @author [[commons:User:Krinkle]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/InterProjectLinks.js]] ([[File:User:Helder.wiki/Tools/InterProjectLinks.js]])
 */
/*jslint browser: true, white: true, plusplus: true*/
/*global jQuery, mediaWiki */
( function ( $, mw /* , undefined */ ) {
'use strict';

function getProjectListHTML() {
	// var interPr = document.getElementById('interProject');
	// if (interPr) {
	//	return interPr.innerHTML;
	// }
	if ($.inArray(mw.config.get('wgNamespaceNumber'), [-1, 2, 3, 8, 9]) === -1) {
		return null;
	}

	var	wiki = [ ], url, server,
		cLang = mw.config.get( 'wgContentLanguage' ),
		langRegExp = new RegExp( '^' + cLang ),
		projName = mw.config.get( 'wgDBname' ),
		pageURLbegin = mw.config.get('wgServer') + mw.config.get('wgArticlePath').replace('/wiki/$1', ''),
		canonicalName = mw.config.get('wgCanonicalNamespace'),
		pageURLend = decodeURI(document.URL.replace(new RegExp ( '^.+?' + $.escapeRE( pageURLbegin ) ), '')),
		list = '',
		i;

	//If the wiki has versions in each language, wgDBname starts with the language code
	if ( langRegExp.test(projName) ) {
		projName = projName.replace(langRegExp, '');
		if (projName === 'wiki') {
			projName = 'wikipedia';
		}
	}

	// FIXME: This seems uncessary after protocol relative URLs
	wiki = wiki.concat( [
		{ text: 'Wikipédia', link: '$1.wikipedia' },
		{ text: 'Wikilivros', link: '$1.wikibooks' },
		{ text: 'Wikisource', link: '$1.wikisource' },
		{ text: 'Wikcionário', link: '$1.wiktionary' },
		{ text: 'Wikiversidade', link: '$1.wikiversity' },
		{ text: 'Wikinotícias', link: '$1.wikinews' },
		{ text: 'Wikiquote', link: '$1.wikiquote' },
		//Wikis without versions in each language
		{ text: 'Wikimedia Commons', link: 'commons.wikimedia' },
		{ text: 'MediaWiki', link: 'www.mediawiki' },
		{ text: 'Meta-Wiki', link: 'meta.wikimedia' },
		{ text: 'Wikispecies', link: 'species.wikimedia' }
	] );

	canonicalName += ':' + (mw.config.get('wgCanonicalSpecialPageName') || mw.config.get('wgTitle').replace(' ', '_'));
	pageURLend = pageURLend.replace( mw.config.get('wgPageName'), canonicalName );

	// var iProjectSys = document.createElement('div');
	// iProjectSys.style.marginTop = '0.7em';
	server = mw.config.get( 'wgServer' ) === 'https://secure.wikimedia.org'? 'https://$1.org' : '//$1.org';
	for ( i=0 ; i < wiki.length; i++ ) {
		if (wiki[i].link.indexOf(projName) !== -1){
			url = server.replace('$1', wiki[i].link.replace('$1', (cLang !== 'pt'? 'pt' : 'en') ) ) + pageURLend;
			list += '<li><a href="' + url + '" style="font-weight:bold;">' + wiki[i].text + (cLang !== 'pt'? '' : ' (EN)') + '<\/a><\/li>';
		} else {
			url = server.replace('$1', wiki[i].link.replace('$1', cLang)) + pageURLend;
			list += '<li><a href="' + url + '">' + wiki[i].text + '<\/a><\/li>';
		}
	}
	// list = '<h3>Correlatos<\/h3><div class="pBody"><ul>' + list + '<\/ul><\/div>';
	list = '<ul>' + list + '<\/ul>';
	return list;
	// iProjectSys.innerHTML = list;
	// document.getElementById( 'p-tb' ).appendChild( iProjectSys );
}

// TODO: Remover parte deste código quando o [[bugzilla:23515]] for resolvido
function renderProjectsPortlet() {
	var idNum, listHTML, toolBox, panel, panelIds, interProject;
	if (document.getElementById('p-interproject')) {
		return;  // avoid double inclusion
	}
	listHTML = getProjectListHTML();
	if (!listHTML) {
		return;
	}

	toolBox = document.getElementById('p-tb');
	if (toolBox) {
		panel = toolBox.parentNode;
	} else {
		// stupid incompatible skins...
		panelIds = ['panel', 'column-one', 'mw_portlets', 'mw-panel'];
		for (idNum = 0; !panel && idNum < panelIds.length; idNum++) {
			panel = document.getElementById(panelIds[idNum]);
		}
		// can't find a place for the portlet, try to undo hiding
		if (!panel) {
			mw.util.addCSS('#interProject, #sisterProjects { display: block; }');
			return;
		}
	}

	interProject = document.createElement('div');
	interProject.id = 'p-interproject';
	interProject.className = (mw.config.get('skin') === 'vector' ? 'portal' : 'portlet') + ' collapsed';

	interProject.innerHTML =
		'<h3>Correlatos<\/h3><div class="' + (mw.config.get('skin') === 'vector' ? 'body' : 'pBody') + '">' +
		listHTML + '<\/div>';

	if (toolBox && toolBox.nextSibling) {
		panel.insertBefore(interProject, toolBox.nextSibling);
	} else {
		panel.appendChild(interProject);
	}
}

if ( mw.config.get( 'wgDBname' ) !== 'ptwikibooks' ) {
	mw.util.addCSS('#interProject, #sisterProjects { display: none; }');
	$(renderProjectsPortlet);
}

}( jQuery, mediaWiki ) );