var Exports = {
  Modules : {}
};

Exports.Modules = (function($, undefined) {
  var $b = "coursebuttonblack",
  removeURL = '/content/gallatin/en/academics/courses.html?',
  course = '',
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
    console.log(buildArray());
  });
  //from sort
  $('.coursedropdown li').click(function (e) {
    event.preventDefault();
    var sortOrder = $(this).find('a').attr('href').replace(removeURL, "").replace(/ /g, '');      
    console.log(buildArray(sortOrder));
  });

  // keep filter panel open if active by removing data-toggle
// keep filter panel open if active by removing data-toggle
    $('.coursebutton').click(function (e) {
      var link = $(this).parents('div.panel-default').find('[data-toggle="collapse"]');
      if ($(this).parents('div.panel-default').find('.coursebuttonselected').length == 0 ) {
        link.attr('data-toggle', 'collapse');
      }          
      else {
        link.attr('data-toggle', 'no-collapse');
      }   
    }); 
  };

  // Get all currently selected filters, search and sort for url and api
  buildArray = function(sortOrder) {
    apiParams = [];
    //filters
    $('.coursebuttonselected').find('a').each(function() {
      var a = $(this).attr('href').replace(removeURL, "");      
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
    if (sortOrder !== undefined) {
      apiParams.push(sortOrder);
    }
    //combine all
    apiParams = apiParams.join('&');
    changeURL(apiParams);
    callAPI(apiParams)
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
  callAPI = function(apiParams) {
    $.getJSON( gallatinAPI+apiParams).done(function( data ) {
      $.each( data.items, function( k, v ) {
        course += '<table><thead><tr><th>'+v.course+'</th><th>Lib Arts<br>'+v['foundation-libarts']+'</th><th>Hist &amp; Cult<br>'+v['foundation-histcult']+'<br></th><th>'+v.term+' '+v.year+'</th></tr></thead><tbody><tr><td colspan="4"><h3>'+v.title+'</h3></td></tr><tr><td>'+v.credit+' units</td><td>'+v.days+'<br />'+v.times+'<br />'+v.days2+'<br />'+v.times2+'</td><td>'
        v.instructors.each(function(i,l) { course += '<a href="'+l+'">'+i+'</a>' });
      course += '</td><td></td></tr><tr><td colspan="4"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-parent="#accordion" data-toggle="collapse" href="#'+v.course+v.term+v.year+'"></a></h4></div><div class="panel-collapse collapse" id="'+v.course+v.term+v.year+'"><div class="panel-body"><p><strong>Description</strong></p>'+v.description+'<hr><p><strong>Type</strong></p><p>'+v.type+'</p></div></div></div></td></tr></tbody></table>'
      });
      $courseTable.html(course); 
      courseCount(data.items.length)
    });
  },

  // Change html to wrap just number in span
  courseCount = function(itemCount) {
    if(itemCount !== undefined) {
      $('.showing-courses').text( function(i,amt) {return amt.replace(/\d+/, itemCount); }); 
    };
  };

return {
  init: init
};
}(jQuery));

$(document).ready(function() {
  Exports.Modules.init();
});
