$('#teacher-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $.get('/teacher?' + search, function(data) {
    $('#teacher-grid').html('');
    data.forEach(function(teacher) {
      $('#teacher-grid').append(`
        <div class="col-md-3 col-sm-6">
          <div class="thumbnail">
            <img src="${ teacher.image }">
            <div class="caption">
              <h4>${ teacher.name }</h4>
            </div>
            <p>
              <a href="/teachers/${ teacher._id }" class="btn btn-primary">More Info</a>
            </p>
          </div>
        </div>
      `);
    });
  });
});

$('#teacher-search').submit(function(event) {
  event.preventDefault();
});