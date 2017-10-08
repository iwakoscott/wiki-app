// Source: https://forum.jquery.com/topic/infinite-bounce-loop
$.fn.infBounce = function(){
  var self = this;
  (function runEffect(){
    self.effect("bounce", {times: 25}, 3200, runEffect)
  })();
}

WikipediaViewModel = function(){
  var that = this;

  that.query = ko.observable("");
  that.articles = ko.observableArray();
  that.error = ko.observable(false);

  that.setMargin = ko.computed(function(){
    if (!that.query() || that.error()) {
      $('.main-box').animate({"margin-top": "15%", "height": "350px"});
      $('.main-header').fadeIn('slow');
      that.articles([]);
      that.error(false);
    }
  });

  that.getSearchBar = function(){
    // expand search input
    function a(){
      $('.search').animate({"width": "65%"}, 300);
      $('.fa-search').stop(true, true);
      window.setTimeout(function(){
        $('.fa-search').one('click', b);
      }, 300);
    }

    function b(){
      $('.search').animate({"width": "0"}, 300);
      window.setTimeout(function(){
        $('.fa-search').one('click', a);
        $('.fa-search').infBounce();
        that.query(null);
      }, 300);
    }

    $('.fa-search').unbind().one('click', a());
  }
  that.getRandomArticle = function(){
    window.open('https://en.wikipedia.org/wiki/Special:Random');
  }

  that.searchForArticle = function(){

    if (!that.query()){
      return false;
    }

    $('.articles').html('');
    that.articles([]);

    var wikiTimeout = setTimeout(function(){
      alert('Wikipedia articles could not be loaded at this time...');
      that.error(true);
    }, 8000)

    var url = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + that.query() + '&format=json&callback=wikiCallback';

    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(response){
        var title = response[1];
        var content = response[2];

        if (!title.length) {
          that.articles.push({
            title: 'No Articles to Show for "' + that.query() + '"...',
            link: null,
            content: null
          });
        } else {
          $('.main-box').animate({"margin-top": 0, 'height': '310px'});
        }

        for (var i = 0; i < title.length; i++){

          var WikiUrl = 'https://en.wikipedia.org/wiki/' + title[i];
          that.articles.push({
            title: title[i],
            link: WikiUrl,
            content: content[i]
          });

        }

        clearTimeout(wikiTimeout);
      }
    });
  }
}

ko.applyBindings(new WikipediaViewModel());

$(document).ready(function(){
  $('.fa-search').infBounce();
});
