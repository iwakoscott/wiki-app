// Source: https://forum.jquery.com/topic/infinite-bounce-loop
$.fn.infBounce = function(){
  var self = this;
  (function runEffect(){
    self.effect("bounce", {times: 15}, 3000, runEffect)
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

  that.showArticles = ko.computed(function(){
    $('.articles').html('');
    for (var i = 0; i < that.articles().length; i++){
      var article = that.articles()[i];
      $('.articles').append(
        '<a href="' + article.link  + '">' +
        '<div class="container article-card">' +
          '<h3 class="article-title">' + article.title + '</h3>' +
          '<p class="article-content">' + article.content + '</p>' +
        '<div></a>'
      );
    }
  });



  that.getSearchBar = function(){
    // expand search input
    function a(){
      $('.fa-search').stop(true, true);
      var self = this;
      $('.search').animate({"width": "65%"}, 300);
      window.setTimeout(function(){
        $(self).one('click', b);
      }, 300);
    }

    function b(){
      var self = this;
      $('.search').animate({"width": "0"}, 300);
      window.setTimeout(function(){
        $(self).one('click', a);
        $('.fa-search').infBounce();
        that.query(null);
      }, 300);
    }

    $('.fa-search').unbind().one('click', a);
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
    $('.main-box').animate({"margin-top": 0, 'height': '275px'});

    $.ajax({
      url: url,
      dataType: 'jsonp',
      success: function(response){
        var title = response[1];
        var content = response[2];
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
})
