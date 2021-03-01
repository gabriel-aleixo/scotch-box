/*
 * jQuery Highlight Regex Plugin v0.1.2
 *
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * (c) 2009-13 Jacob Rothstein
 * MIT license
 */

(function($) {
  var normalize = function( node ) {
    if ( ! ( node && node.childNodes )) return;

    var children     = $.makeArray( node.childNodes )
    ,   prevTextNode = null;

    $.each( children, function( i, child ) {
      if ( child.nodeType === 3 ) {
        if ( child.nodeValue === "" ) {

          node.removeChild( child );

        } else if ( prevTextNode !== null ) {

          prevTextNode.nodeValue += child.nodeValue;
          node.removeChild( child );

        } else {

          prevTextNode = child;

        }
      } else {  
        prevTextNode = null

        if ( child.childNodes ) {
          normalize( child );
        }
      }
    });
    
  };


$.fn.highlightRegex = function( regex, options ) {

  if ( typeof options === 'undefined' ) options = {}

  options.className = options.className || 'highlight';
  options.tagType   = options.tagType   || 'span';
  options.attrs     = options.attrs     || {};

  if ( typeof regex === 'undefined' || regex.source === '' ) {

    $( this ).find( options.tagType + '.' + options.className ).each( function() {

      $( this ).replaceWith( $( this ).text() );

      normalize( $( this ).parent().get( 0 ));
      

    });

  } else {
   
    $( this ).each( function() {

      var elt = $( this ).get( 0 );

      normalize( elt );

      $.each( $.makeArray( elt.childNodes ), function( i, searchnode ) {

        var spannode, middlebit, middleclone, pos, match, parent;

        normalize( searchnode );
       

        if ( searchnode.nodeType == 3 ) {

          while ( searchnode.data &&
                  ( pos = searchnode.data.search( regex )) >= 0 ) {

            match = searchnode.data.slice( pos ).match( regex )[ 0 ]

            if ( match.length > 0 ) {

              spannode = document.createElement( options.tagType );
              spannode.className = options.className;
              $(spannode).attr(options.attrs);

              parent      = searchnode.parentNode;
              middlebit   = searchnode.splitText( pos );
              searchnode  = middlebit.splitText( match.length );
              middleclone = middlebit.cloneNode( true );

              spannode.appendChild( middleclone );
              parent.replaceChild( spannode, middlebit );

            } else break
          }

        } else {

          $( searchnode ).highlightRegex( regex, options );

        }
      });
    });
  }

  return $( this );
}


  jQuery.fn.highlight = function(pat, classname) {
    function innerHighlight(node, pat) {
      var skip = 0;
      if (node.nodeType == 3) {
        var pos = node.data.toUpperCase().indexOf(pat);
        pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
        if (pos >= 0) {
          var spannode = document.createElement('span');
          spannode.className = classname;
          //spannode.className = 'highlight-format';
          var middlebit = node.splitText(pos);
          var endbit = middlebit.splitText(pat.length);
          var middleclone = middlebit.cloneNode(true);
          spannode.appendChild(middleclone);
          middlebit.parentNode.replaceChild(spannode, middlebit);
          skip = 1;
        }
      }
      else if (node.nodeType == 1 && node.childNodes && !/(script|style)/i.test(node.tagName)) {
        for (var i = 0; i < node.childNodes.length; ++i) {
          i += innerHighlight(node.childNodes[i], pat);
        }
      }
      return skip;
    }
    return this.length && pat && pat.length ? this.each(function() {
      innerHighlight(this, pat.toUpperCase());
    }) : this;
  };

  jQuery.fn.removeHighlight = function(classname) {
    return this.find(classname).each(function() {
      this.parentNode.firstChild.nodeName;
      with (this.parentNode) {
        replaceChild(this.firstChild, this);
        normalize();
      }
    });
    return this.find(classname).each(function() {
      this.parentNode.firstChild.nodeName;
      with (this.parentNode) {
        replaceChild(this.firstChild, this);
        normalize();
      }
    }).end();
  };
    
   
})( jQuery );
