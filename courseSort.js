var Exports = {
  Modules : {}
};

Exports.Modules = (function($, undefined) {
  var $b = "coursebuttonblack",
  apiParams = 'year=2015',
  removeURL = '/content/gallatin/en/academics/courses.html?',
  course = '',
  urlParams = window.location.search,
  gallatinAPI = "http://gallatin.nyu.edu/academics/courses/jcr:content/content/search.json?";

init = function() {
  initFilters();
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
  });
  //from searchbar
  $('form[name=course-search]').on('submit', function(event){
    event.preventDefault();
    var $search = $(this).find('[name=query]');
  });
  //from sort
  $('.coursedropdown li').click(function (e) {
    event.preventDefault();
    var sortOrder = $(this).find('a').attr('href').replace(removeURL, "").replace(/ /g, '');      
  });

  // keep filter panel open if active by removing data-toggle
  $('.coursebutton').click(function (e) {
    var link = $(this).parents('div.panel-default').find('[data-toggle]');
    if ($(this).parents('div.panel-default').find('.coursebuttonselected').length >= 1 ) {
      $(link).attr('data-toggle', 'no-collapse');
    } else {
      $(link).attr('data-toggle', 'collapse');
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
    $.getJSON( gallatinAPI+apiParams, function( data ) {
      var course = '';
      var instructors = "";
      var count = 0;
      $.each( data, function( k, v ) {
        count++;
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
