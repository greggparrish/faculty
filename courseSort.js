var Exports = {
  Modules : {}
};

Exports.Modules = (function($, undefined) {
  var $grid,
  $b = "coursebuttonselected",
  $term = $('sort-term'),
  $years = $('sort-year'),
  $levels = $('sort-level'),
  $types = $('sort-type'),
  $foundations = $('sort-foundation'),
  $credits =$('sort-credit'),
  term = [],
  years = [],
  levels = [],
  types = [],
  foundations = [],
  credits = [],

  init = function() {
    setVars();
    initFilters();
    initList();
  },

  setVars = function() {
    $courseTable = $('.courseList');
  },

  initList = function() {
    var course = '';
    var gallatinAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
    $.getJSON( gallatinAPI, {
      tags: "split croatia",
      tagmode: "any",
      format: "json"
    })
    .done(function( data ) {
      $.each( data.items, function( k, v ) {
        course += '<div>'
        course += v.title
        course += '</div>'
      });
      $courseTable.html(course); 
      var courseCount = data.items.length
      // Change html to wrap just number in span
      $('.showing-courses').text(courseCount);
    });
  },

  initFilters = function() {
    // reset button
    $('.coursebuttonblack').click(function (e) {
      filterReset();
    });

    /* search bar */
    $('#course-search-button, #sort-search').on('click keyup change', function() {
      var val = document.getElementById('sort-search').value.toLowerCase();
      filterReset();
      $grid.shuffle('shuffle', function($el, shuffle) {
        if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('groups')) === -1) {
          return false;
        }
        var text = $.trim( $el.data('groups') ).toLowerCase();
        return text.indexOf(val) !== -1;
      });
      courseCount();
    });

    // reset filters
    filterReset = function() {
      $grid.shuffle('shuffle', 'all'); 
      $('.coursebutton').removeClass($b);
      $('[data-parent="#accordion"]').each(function() {
        var linkTarget = $(this).attr('href').replace(/[^a-zA-Z 0-9]+/g, '');
        $(this).attr('href', '#' + linkTarget);
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

    // terms
    $('.sort-term button').on('click', function () {
      var sGroups = [];
      $(this).parent().toggleClass($b);
      $('a#terms').attr('data-toggle','');
      $checked = getChecked('term');
      if ($checked.length !== 0) {
        sGroups = buildArray('sort-term');
      }
      terms= sGroups;
      keepOpen($(this), terms);
      filter();
    });
    // years
    $('.sort-year button').on('click', function () {
      var yGroups = [];
      $(this).parent().toggleClass($b);
      $checked = getChecked('year');
      if ($checked.length !== 0) {
        yGroups = buildArray('sort-year');
      }
      years = yGroups;
      keepOpen($(this), years);
      filter();
    });
    // levels
    $('.sort-level button').on('click', function () {
      var lGroups = [];
      $(this).parent().toggleClass($b);
      $checked = getChecked('level');
      if ($checked.length !== 0) {
        lGroups = buildArray('sort-level');
      }
      levels = lGroups;
      keepOpen($(this), levels);
      filter();
    });
    // types
    $('.sort-type button').on('click', function () {
      var tGroups = [];
      $(this).parent().toggleClass($b);
      $checked = getChecked('type');
      if ($checked.length !== 0) {
        tGroups = buildArray('sort-type');
      }
      types = tGroups;
      keepOpen($(this), types);
      filter();
    });
    // foundation
    $('.sort-foundation button').on('click', function () {
      var fGroups = [];
      $(this).parent().toggleClass($b);
      $checked = getChecked('foundation');
      if ($checked.length !== 0) {
        fGroups = buildArray('sort-foundation');
      }
      foundations = fGroups;
      keepOpen($(this), foundations);
      if ( hasActiveFilters() ) {
        $grid.shuffle('shuffle', function($el, shuffle) {
          if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('sort-foundation')) === -1) {
            return false;
          }
          var text = $.trim( $el.data('sort-foundation') );
          return text.indexOf(fGroups) !== -1;
        });
        courseCount();
      } else {
        $grid.shuffle( 'shuffle', 'all' ); 
        courseCount();
      }
    });
    // credits
    $('.sort-credit button').on('click', function () {
      var cGroups = [];
      $(this).parent().toggleClass($b);
      $checked = getChecked('credit');
      if ($checked.length !== 0) {
        cGroups = buildArray('sort-credit');
      }
      credits = cGroups;
      keepOpen($(this), credits);
      filter();
    });
  },

  getChecked = function(type) {
    var checked = [];
    checked = $('.sort-'+type).find('.'+$b);
    return checked;
  },

  buildArray = function(type) {
    var valArray = []; 
    $otherFilters = $('.'+type).find('.'+$b);
    $otherFilters.each(function(){ 
      var filterValue = $(this).children(":first").data(type);
      valArray.push(filterValue);
    });
    return valArray;
  },

  filter = function() {
    if ( hasActiveFilters() ) {
      $grid.shuffle('shuffle', function($el, shuffle) {
        return itemPassesFilters( $el.data() );
      });
      courseCount();
    } else {
      $grid.shuffle( 'shuffle', 'all' ); 
      courseCount();
    }
  },

  itemPassesFilters = function(data) {
    if ( terms.length > 0 && !valueInArray(data.sortTerm, terms) ) {
      return false;
    }
    if ( years.length > 0 && !valueInArray(data.sortYear, years) ) {
      return false;
    }
    if ( levels.length > 0 && !valueInArray(data.sortLevel, levels) ) {
      return false;
    }
    if ( types.length > 0 && !valueInArray(data.sortType, types) ) {
      return false;
    }
    if ( foundations.length > 0 && !valueInArray(data.sortFoundation, foundations) ) {
      return false;
    }
    if ( credits.length > 0 && !valueInArray(data.sortCredit, credits) ) {
      return false;
    }
    return true;
  },

  hasActiveFilters = function() {
    return terms.length > 0 || years.length > 0 || levels.length > 0 || types.length > 0 || foundations.length > 0 || credits.length > 0 ;
  },

  valueInArray = function(value, arr) {
    return $.inArray(value, arr) !== -1;
  },

  courseCount = function() {
    var $courseCount = $('.courseList').find('.filtered');
    $('.course-count').text($courseCount.length);
  };

return {
  init: init
};
}(jQuery));

$(document).ready(function() {
  Exports.Modules.init();
});


