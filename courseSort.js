var Exports = {
  Modules : {}
};

Exports.Modules = (function($, undefined) {
  var $b = "coursebuttonblack",
  course = '',
  ftags = '',
  gallatinAPI = "http://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json?";

  init = function() {
    setVars();
    initFilters();
    initAPI();
  },

  setVars = function() {
    $courseTable = $('.courseList');
  },

  // Display on site
  initAPI = function() {
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

  initFilters = function() {
    // reset button
    $('.coursebuttonblack').click(function (e) {
      e.preventDefault();
      filterReset();
    });

    // On button click, disable link, add active class, grab all active filters, plus sort and search
    $('.coursebutton').click(function (e) {
      e.preventDefault();
      $(this).toggleClass('coursebutton coursebuttonselected');
      console.log(buildArray());
    });

    // reset filters
    filterReset = function() {
      $('.coursebuttonselected').toggleClass('coursebutton coursebuttonselected');
      $('[data-parent="#accordion"]').each(function() {
        if (!$(this).hasClass('collapsed')) {
          $(this).addClass('collapsed');
          $(this).attr('aria-expanded', 'false');
          $(".panel-collapse").removeClass('in');
          $(".panel-collapse").attr('aria-expanded', 'false');
        }
      });
      courseCount();
    };

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

  buildArray = function(type) {
    var valArray = []; 
    $('.coursebuttonselected').find('a').each(function() {
      var a = $(this).attr('href').replace("/content/gallatin/en/academics/courses.html?", "");      
      valArray.push(a);
    });
    return valArray.join('&');
  },

  courseCount = function(itemCount) {
    // Change html to wrap just number in span
    $('.showing-courses').text(itemCount);
  };

return {
  init: init
};
}(jQuery));

$(document).ready(function() {
  Exports.Modules.init();
});


