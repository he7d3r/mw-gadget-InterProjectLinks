/** Adiciona ligações para os correlatos na barra lateral ([[phab:T2708]])
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
 */
(function (mw, $) {
    'use strict';

    function projectName() {
        var cfg = mw.config.get([
            'wgContentLanguage',
            'wgDBname'
        ]);
        var langRegExp = new RegExp('^' + cfg.wgContentLanguage);

        if (!langRegExp.test(cfg.wgDBname)) {
            return cfg.wgDBname;
        }

        var projName = cfg.wgDBname.replace(langRegExp, '');

        if (projName === 'wiki') {
            projName = 'wikipedia';
        }

        return projName;
    }

    function actualLinkInfo(info, language, project) {
        if (info.link.indexOf(project) !== -1) {
            return {
                text: info.text + (language !== 'pt' ? '' : ' (EN)'),
                url: info.link.replace('$1', (language !== 'pt' ? 'pt' : 'en')),
                bold: true
            };
        }
        return {
            text: info.text,
            url: info.link.replace('$1', language),
            bold: false
        };
    }

    function getPageURLEnd() {
        var cfg = mw.config.get([
            'wgServer',
            'wgArticlePath',
            'wgCanonicalNamespace',
            'wgCanonicalSpecialPageName',
            'wgTitle',
            'wgPageName'
        ]);
        var path = cfg.wgArticlePath.replace('/wiki/$1', '');
        var canonicalName = cfg.wgCanonicalNamespace + ':' + (cfg.wgCanonicalSpecialPageName || cfg.wgTitle.replace(/ /g, '_'));
        var pageURLBeginRegExp = new RegExp('^(?:https?:)?' + mw.util.escapeRegExp(cfg.wgServer + path));
        return decodeURI(document.URL.replace(pageURLBeginRegExp, '')).replace(cfg.wgPageName, canonicalName);
    }

    function addPortletLinks() {
        var wiki = [
            { text: 'Wikipédia', link: '//$1.wikipedia.org' },
            { text: 'Wikilivros', link: '//$1.wikibooks.org' },
            { text: 'Wikisource', link: '//$1.wikisource.org' },
            { text: 'Wikcionário', link: '//$1.wiktionary.org' },
            { text: 'Wikiversidade', link: '//$1.wikiversity.org' },
            { text: 'Wikinotícias', link: '//$1.wikinews.org' },
            { text: 'Wikivoyage', link: '//$1.wikivoyage.org' },
            { text: 'Wikiquote', link: '//$1.wikiquote.org' },
            // Wikis without versions in each language
            { text: 'Wikimedia Commons', link: '//commons.wikimedia.org' },
            { text: 'MediaWiki', link: '//www.mediawiki.org' },
            { text: 'Wikidata', link: '//www.wikidata.org' },
            { text: 'Meta-Wiki', link: '//meta.wikimedia.org' },
            { text: 'Wikispecies', link: '//species.wikimedia.org' }
        ];

        var cfg = mw.config.get([
            'wgContentLanguage',
            'wgDBname'
        ]);
        var project = projectName(cfg.wgDBname, cfg.wgContentLanguage);
        var actualLinks = wiki.map(function (info) {
            return actualLinkInfo(info, cfg.wgContentLanguage, project);
        });
        var urlEnd = getPageURLEnd();

        actualLinks.forEach(function (link) {
            var node = mw.util.addPortletLink('p-interproject', link.url + urlEnd, link.text);
            if (link.bold) {
                $(node).find('a').css('font-weight', 'bold');
            }
        });
    }

    function run() {
        var allowedNamespaces = [-1, 2, 3, 8, 9];
        if (allowedNamespaces.indexOf(mw.config.get('wgNamespaceNumber')) === -1) {
            return;
        }

        var p = mw.util.addPortlet('p-interproject', 'Correlatos', '#p-tb');
        if (p) {
            p.parentNode.appendChild(p);
        }
        addPortletLinks();
    }

    if (mw.config.get('wgDBname') !== 'ptwikibooks') {
        $.when(
            mw.loader.using(['mediawiki.util']),
            $.ready
        ).then(run);
    }
})(mediaWiki, jQuery);