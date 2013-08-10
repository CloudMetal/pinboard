javascript: (function (){

  var minMediaWidth = 50;

  // convenience methods
  var slice = [].slice;

  var $ = function (selector, context) {
    return new $.init(selector, context);
  };

  $.extend = function () {
    var result = arguments[0];
    [].slice.call(arguments, 1).forEach(function (source) {
      for (var key in source) {
        result[key] = source[key];
      }
    });
    return result;
  };

  // Extending the $ function (created above) to include a unique function
  $.extend($, {
    
    // The unique function takes in an array and returns a new array that doesn't have any repeated items
    unique: function (array) {
      
      // Create new array
      var results = [];
      
      // Loop through passed in array
      array.forEach(function (item) {
        
        // For each item, check if its in the new array already, if not add it to the array
        if (results.indexOf(item) === -1) {
          results.push(item);
        }
      });
      
      // Return new array
      return results;
    }
  });

  $.init = function (selector, context) {
    
    // Assign a reference for the selector parameter
    this.selector = selector;
    
    // Assign a reference for the context parameter
    // If content is undefined, then the context is window.document
    this.context = context || window.document;

    // Split the selector by space, and get the last part of the selector
    var selectorParts = this.selector.split(' ');
    var lastSelectorPart = selectorParts[selectorParts.length-1];
    
    // If the selector starts with '#' - meaning its an ID, then use querySelector. Else if the selector is a class, use querySelectorAll instead
    var elements = lastSelectorPart.charAt(0) === '#'? this.context.querySelector(this.selector) : this.context.querySelectorAll(this.selector);

    // If elements is an ID, then make an array with the ID value. If the element is a class, then break the elements into an array using [].slice.call. We need to use [].slice.call because querySelectorAll returns a NodeList rather than an array.
    var results = (!elements.length)? [elements] : [].slice.call(elements);

    return $.extend(results, this);
  };

  // Allows the use of $(selector).on OR
  // $(selector).off OR
  // $(selector). remove
  $.init.prototype = {
    // Creating our custom '.on' listener
    on: function (type, selector, handler) {

      // this refers to the element being clicked
      var self = this;
      var onHandler = handler;
      if (selector) {
        onHandler = function (event) {
          if (event.target.webkitMatchesSelector(selector)) {
            handler.apply(self, arguments);
          }
        };
      }
      // create a variable on the DOM element to store all the listeners info
      this._listeners = this._listeners || [];
      this._listeners.push({
        type: type,
        handler: onHandler
      });
      this.forEach(function (item) {
        item.addEventListener(type, onHandler);
      });
      return this;
    },

    off: function (type, handler) {
      var self = this;
      var listenersToRemove = this._listeners || [];
      if (arguments.length) {
        listenersToRemove = this._listeners.filter(function (item) {
          return item.type === type && item.handler === handler;
        });
      }
      this.forEach(function (element) {
        listenersToRemove.forEach(function (item) {
          // remove listener from internal collection
          var index = self._listeners.indexOf(item);
          if (index !== -1) self._listeners.splice(index, 1);
          // remove handler
          element.removeEventListener(item.type, item.handler);
        });
      });
      return this;
    },

    remove: function () {
      // remove all listeners
      this.off();
      // remove from DOM
      this.map(function (item) {
        return item.parentNode.removeChild(item);
      });
      return this;
    }
  };

  var data = {

    // Assign url to current window location
    url: window.location.href,

    // Assign thumbnailUrl
    thumbnailUrl: '',

    // Deciding how to assign the description of the pin
    // Look for og:description first
    // If og:description doesn't exist, look for description
    // If none of the descriptions exist, use page's title
    description: function () {
      var description;
      var title = document.title;
      var metaTags = slice.call($('meta'));
      if (metaTags.length) {
        description = slice.call($('meta')).sort(function (a, b) {
          if(a.name > b.name) return -1;
          if(a.name < b.name) return 1;
          return 0;
        }).filter(function (item, index, arr) {
          return item.name.match(/description|og:description/);
          // Return a new array which the values of the return 
        }).map(function (item, index, arr) {
          return item.content;
        })[0];
      }
      return description || title;
    }()
  };

  var imageModal = function () {
    var $imgs = $('img');

    var list = slice.call($imgs).filter(function (item, index, arr) {
      return item.width >= minMediaWidth;
    }).map(function (item, index, arr) {
      return item.src;
    });

    list = $.unique(list).map(function (item, index, arr) {
      var mediaName = item.substring(item.lastIndexOf('/')+1);
      var listItem = ' \
        <li> \
          <img class="media-item" data-js-action="select" src="' + item + '"/> \
        </li> \
      ';
      return listItem;
    });

    var template = '\
      <div data-js-action="cancel" id="frog-pinterest-modal-mask"></div>
      <ul id="frog-pinterest-image-list"> \
      <li class="frog-pinterest-title-list"><h1>Select a thumbnail</h1></li>' + list.join('\n') + '</ul>';

    var modal = document.createElement('section');
    modal.id = 'frog-pinterest-modal';
    // insert template into modal element
    modal.innerHTML = template;

    return modal;
  }();

  document.body.appendChild(imageModal);

  var mediaClones = document.querySelectorAll("#frog-pinterest-image-list li");
  for (var i=0; i<mediaClones.length; i++){
    console.log('mediaClones[i]', mediaClones[i]);
   //setTimeout(function(){ mediaClones[i].className += 'active'; }, (i+1) * 1000);
  }

  // styles
  var styles = ' \
    #frog-pinterest-modal { \
    height: 100%; \
    left: 0; \
    position: fixed; \
    top: 0; \
    width: 100%; \
    z-index: 1000000000000; \
  } \
  #frog-pinterest-modal-mask { \
    width: 100%; \
    height: 100%; \
    background: rgba(0,0,0,0); \
    position: fixed; \
    top: 0; \
    left: 0; \
    z-index: 0; \
  } \
  #frog-pinterest-modal, \
  #frog-pinterest-modal * { \
    -moz-box-sizing: border-box; \
    -webkit-box-sizing: border-box; \
    box-sizing: border-box; \
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; 
    font-weight: 300;
  } \
  #frog-pinterest-modal:before { \
    background: rgba(51, 114, 23, 0.95); \
    content: ""; \
    display: block; \
    height: 100%; \
    position: absolute; \
    width: 100%; \
    z-index: -1; \
  } \
  #frog-pinterest-modal header { \
    -moz-box-sizing: border-box; \
    -webkit-box-sizing: border-box; \
    border-bottom: 1px solid rgba(0,0,0,0.3); \
    box-sizing: border-box; \
    overflow: hidden; \
  } \
  #frog-pinterest-image-list { \
    background: rgba(231, 231, 231, 1); \
    box-sizing: border-box; \
    line-height: 0; \
    list-style: none; \
    margin: 65px auto 0 auto; \
    max-height: 580px; \
    overflow: scroll; \
    padding: 154px 0 0 0; \
    position: relative; \
    width: 577px; \
  } \
  #frog-pinterest-image-list li.frog-pinterest-title-list { \
    background: rgba(56,179,0,0.98); \
    height: 154px; \
    margin: 0 auto; \
    opacity: 1; \
    padding: 33px 0 31px 27px; \
    position: fixed; \
    top: 65px; \
    width: 577px; \
    z-index: 1000; \
  } \
  #frog-pinterest-image-list li.frog-pinterest-title-list:before { \
    background-image: url(http://ryanko.me/img/frog-icon.png); \
    content: ""; \
    display: block; \
    height: 109px; \
    opacity: 0.13; \
    position: absolute; \
    right: 28px; \
    top: 17px; \
    width: 106px; \
  } \
  .frog-pinterest-title-list h1 { \
    -webkit-font-smoothing: subpixel-antialiased; \
    color: #fff; \
    cursor: auto; \
    display: block; \
    font-size: 17px; \
    letter-spacing: 3px; \
    line-height: 0; \
    margin: 0; \
    opacity: 1; \
    padding: 0; \
    text-align: left; \
    text-shadow: 0 0 0 #000; \
    width: 100%; \
  } \
  .frog-pinterest-title-list h2 { \
    color: #aaa; \
    cursor: auto; \
    display: block; \
    font-size: 14px; \
    height: auto; \
    letter-spacing: 1px; \
    margin: 0; \
    opacity: 1; \
    padding: 0; \
    text-align: center; \
    width: 100%; \
  } \
  #frog-pinterest-image-list li { \
    background: #fff; \
    cursor: pointer; \
    float: left; \
    opacity: 0.8; \
    position: relative; \
    width: 25%; \
  } \
  #frog-pinterest-image-list li:hover { \
    opacity: rgba(255,255,255,0.98); \
  } \
  #frog-pinterest-image-list li img { \
    width: 100%; \
  } \
  .frog-pinterest-nano-button { \
    border-left: 1px solid rgba(255,255,255,0.06); \
    border-right: 1px solid rgba(255,255,255,0.06); \
    box-shadow: 0 0 1px #000000; \
    color: #fff; \
    font-size: 15px; \
    line-height: 44px; \
    padding: 28px 18px; \
    text-shadow: 0 1px 2px #000; \
  } \
  #frog-pinterest-modal footer { \
    left: 0; \
    padding:0 20px 20px; \
    position: absolute; \
    text-align: right; \
    top: 0; \
    z-index: 100; \
  } \
  #frog-pinterest-modal footer a { \
    background: #d4ecfb; \
    border: 1px solid #78c3f1; \
    color: #000; \
    display: inline-block; \
    margin-left: 20px; \
    padding:4px 10px; \
    text-decoration: none; \
  } \
  ';

  var css = document.createElement('style');
  css.id = "frog-pinterest-modal-styles";
  css.type = "text/css";

  css.appendChild(document.createTextNode(styles));
  document.head.appendChild(css);

  var pinPage = function () {
    console.log('data', data);
  };

  var $modal = $('#frog-pinterest-modal');
  $modal.on('click', '[data-js-action=cancel]', onCancel);
  $modal.on('click', '[data-js-action=select]', onSelect);

  function onCancel(event) {
    event.preventDefault();
    removeModal();
  };

  function onSelect(event) {
    data.thumbnailUrl = event.srcElement.src;
    removeModal();
    launchChildWindow();
  };

  function removeModal() {
    $modal.remove();
  };

  function launchChildWindow() {
    
    // Setting options for the child window
    var options = [
      'toolbars=0',
      'width=750',
      'heigth=500',
      'scrollbars=no',
      'resizable=no',
      'menubar=no',
      'location=no',
      'toolbar=no'
    ].join(',');

    // Creating modal template
    var modalTemplate = ' \
      <section id="frog-pinterest-child-modal"> \
        <span>Image from: ' + data.url + '</span> \
        <img src="' + data.thumbnailUrl + '"/> \
        <textarea>' + data.description + '</textarea> \
        <a href="#" data-js-action="save">Pin it!</a> \
      </section> \
    ';

    var childWindow = window.open('', '', options);
    childWindow.document.body.innerHTML = modalTemplate;

    var $saveButton = $('[data-js-action=save]', childWindow.document);
    $saveButton.on('click', '', function (event) {
      event.preventDefault();
      childWindow.close();
      pinPage();
    });

    var $description = $('textarea', childWindow.document).on('change', '', function (event) {
      console.log('value = ', event.target.value);
      data.description = event.target.value;
    });
  };
})();
