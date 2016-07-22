var Exports = {
  Modules : {}
};

Exports.Modules = (function($, undefined) {
  var $b = "coursebuttonblack",
  apiParams = 'year=2015',
  removeURL = '/content/gallatin/en/academics/courses.html?',
  course = '',
  baseurl = window.location.href.split('?')[0],
  urlParams = window.location.search,
  gallatinAPI = "http://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json?"
  //gallatinAPI = "/content/gallatin/en/academics/courses/jcr:content/content/search.json?"

  init = function() {
    openPanels();
    initFilters();
  },

  openPanels = function() {
    // on load, check to see if active filters, if so, open their respective panels
    if ($(".course-filter").find(".coursebuttonselected").length > 0){ 
      var panel = $('.coursebuttonselected').parents('div.panel-default');
      $(panel).find('[data-toggle]').attr('data-toggle', 'no-collapse').removeClass('collapsed');
      $(panel).find('.panel-collapse').addClass('in');
    }
  },

  initFilters = function() {

    // reset button
    $('.coursebuttonblack').click(function(event) {
      event.preventDefault();
      $('.coursebuttonselected').toggleClass('coursebutton coursebuttonselected');
      $("[data-toggle='no-collapse']").attr('data-toggle', 'collapse').addClass('collapsed').attr('aria-expanded', 'false');
      $(".panel-collapse").removeClass('in').attr('aria-expanded', 'false');
      $('.course-filter').each(function() {
        if (!$(this).hasClass('collapsed')) {
          $(this).addClass('collapsed').attr('aria-expanded', 'false');
        }
      });
      changeURL('');
      callAPI('');
      courseCount();
    });
    // On filter click/search/sort, disable link, add active class
    $('.panel-body div').click(function(event) {
      event.preventDefault();
      $(this).toggleClass('coursebutton coursebuttonselected');
      buildArray();
    });
    //from searchbar
    $('form[name=course-search]').on('submit', function(event){
      $('form[name=course-search]').val('');
      event.preventDefault();
      var $search = $(this).find('[name=query]');
      buildArray();
    });
    //from sort
    $('.coursedropdown li').click(function(event) {
      event.preventDefault();
      var sortOrder = $(this).find('a').attr('href').replace(removeURL, "").replace(/ /g, '');      
      buildArray(sortOrder);
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
  if (b !== '') {
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
  $('.courseList').html('')
    callAPI(apiParams)
},

  // Add filters to url and history
  changeURL = function(varArray) {
    if(history.pushState) {
      history.pushState(null, null, baseurl+'?'+varArray);
    }
    return false;   
  },
  // get API results and pop div
  callAPI = function(apiParams) {
    $.getJSON( gallatinAPI+apiParams, function( data ) {
      var course = '';
      var instructors = "";
      var count = data['totalMatches'];
      delete data['totalMatches'];
      $.each( data, function( k, v ) {
        if (v['foundation-libarts'] == null) { v['foundation-libarts'] = ''; }
        if (v['foundation-histcult'] == null) { v['foundation-histcult'] = ''; }
        if (v.times == null) { v.times = ''; }
        if (v.times2 == null) { v.times2 = ''; }
        course += '<table><thead><tr><th>'+v.course+'</th><th>Lib Arts<br>'+v['foundation-libarts']+'</th><th>Hist &amp; Cult<br>'+v['foundation-histcult']+'<br></th><th>'+v.term+' '+v.year+'</th></tr></thead><tbody><tr><td colspan="4"><h3>'+v.title+'</h3></td></tr><tr><td>'+v.credit+' units</td><td>'+v.days+'<br />'+v.times+'<br />'+v.days2+'<br />'+v.times2+'</td><td>'
        if (v.instructors !== undefined) {
          var name = Object.keys(v.instructors[0])[0];
          var link = v.instructors[0][name];
          course += '<a href="'+link+'">'+name+'</a>';
          if(v.instructors > 1) {
            var name = Object.keys(v.instructors[1])[0];
            var link = v.instructors[1][name];
            course += '<br /><a href="'+link+'">'+name+'</a>';
          }
        }
      course += '</td><td></td></tr><tr><td colspan="4"><div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a class="collapsed" data-parent="#accordion" data-toggle="collapse" href="#'+v.course+v.term+v.year+'"></a></h4></div><div class="panel-collapse collapse" id="'+v.course+v.term+v.year+'"><div class="panel-body"><p><strong>Description</strong></p>'+v.description+'<hr><p><strong>Type</strong></p><p>'+v.type;
      if (!!v.notes){ course+= '<hr><p><strong>Note</strong></p><p>'+v.notes+'</p>'; }
      if (!!v.syllabus){ course+= '<hr><p><strong>Syllabus</strong></p><p><a href="'+v.syllabus+'">Link</a></p>'; }
      course += '</div></div></div></td></tr></tbody></table>'
      });
      $('.courseList').html(course); 
      courseCount(count);
    }).fail(function(d) {
      courseCount(0);
    });
  },

  // Change found courses to number or "over 200"
  courseCount = function(itemCount) {
    if(itemCount !== undefined) {
      if(itemCount == 0) {
        $('.showing-courses').text( "No results were found for your search"); 
      }
      else if(itemCount < 200) {
        $('.showing-courses').text( "Found " + itemCount + " courses"); 
      }
      else if (itemCount > 200) {
        $('.showing-courses').text('Found more than 200'); 
      }
    };
  };

return {
  init: init
};
}(jQuery));

$(document).ready(function() {
  Exports.Modules.init();
});
