var Exports = {
  Modules : {}
};

Exports.Modules = (function($, undefined) {
  var $b = "coursebuttonblack",
  course = '',
  ftags = '',
  urlParams = window.location.search,
  gallatinAPI = "http://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json?";

  init = function() {
    setVars();
    initFilters();
  },

  setVars = function() {
    $courseTable = $('.courseList');
  },

  initFilters = function() {

    // reset button
    $('.coursebuttonblack').click(function (e) {
      e.preventDefault();
      $('.coursebuttonselected').toggleClass('coursebutton coursebuttonselected');
      $('[data-parent="#accordion"]').each(function() {
        if (!$(this).hasClass('collapsed')) {
          $(this).addClass('collapsed');
          $(this).attr('aria-expanded', 'false');
          $(".panel-collapse").removeClass('in');
          $(".panel-collapse").attr('aria-expanded', 'false');
        }
      });
      changeURL('');
      courseCount();
    });

    // On filter click/search/sort, disable link, add active class
    $('.coursebutton').click(function (e) {
      e.preventDefault();
      $(this).toggleClass('coursebutton coursebuttonselected');
      console.log(buildArray());
    });
    //from searchbar
    $('form[name=course-search]').on('submit', function(event){
      event.preventDefault();
      var $search = $(this).find('[name=query]');
      console.log($search.val());
      console.log(buildArray());
    });

    // keep filter panel open if active by removing data-toggle
    keepOpen = function(t, g) {
      var link = t.parents('div.panel-default').find('[data-toggle="collapse"]').attr('href');
      var linkReset = link.replace(/\$/g, '');
      if (g.length === 0 ) {
        t.parents('div.panel-default').find('[data-toggle="collapse"]').attr('href', linkReset);
      } else { 
        t.parents('div.panel-default').find('[data-toggle="collapse"]').attr('href', link+'$');
      }
    };
  },

  // Get all currently selected filters, search and sort for url and api
  buildArray = function() {
    var apiParams = []; 
    //filters
    $('.coursebuttonselected').find('a').each(function() {
      var a = $(this).attr('href').replace("/content/gallatin/en/academics/courses.html?", "");      
    var allFilters = [a]
      apiParams.push(allFilters);
    });
    //search
    var b = $('form[name=course-search]').find('[name=query]').val();
    if (b != '') {
      var searchParam = ('query='+b).replace(' ','+'); 
      apiParams.push(searchParam);
    }
    //sort
    
    
    //combine all
    apiParams = apiParams.join('&');
    changeURL(apiParams);
    return apiParams;
  },

  // Add filters to url and history
  changeURL = function(varArray) {
    if(history.pushState) {
      history.pushState(null, null, '/gallatin?'+varArray);
    }
    return false;   
  },

  // get API results and pop div
  callAPI = function() {
    console.log(ftags);
    $.getJSON( gallatinAPI+ftags).done(function( data ) {
      $.each( data.items, function( k, v ) {
        course += '<div>'
        course += v.title
        course += '</div>'
      });
      $courseTable.html(course); 
      courseCount(data.items.length)
    });
  },

  courseCount = function(itemCount) {
    // Change html to wrap just number in span
    $('.showing-courses').text( function(i,txt) {return txt.replace(/\d+/, itemCount); }); 
  };

return {
  init: init
};
}(jQuery));

$(document).ready(function() {
  Exports.Modules.init();
});


