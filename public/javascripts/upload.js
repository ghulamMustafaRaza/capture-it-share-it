$('.upload-btn').on('click', function (){
  if ($('.author').val()) 
    {
      $('#upload-input').click();
      $('.progress-bar').text('0%');
      $('.progress-bar').width('0%');
    }
  else {
    // document.getElementById('upload-box').innerHTML += `<div class="alert alert-warning alert-dismissible" role="alert">
    //   <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    //   <strong>Warning!</strong> Better check yourself, you're not looking too good.
    // </div>`
    $('#myModal').modal('show')
    // alert('Author Name is Required')
  }
});

$('#upload-input').on('change', function(){
var author = $('.author').val();
var files = $(this).get(0).files;

if (files.length > 0){
  // create a FormData object which will be sent as the data payload in the
  // AJAX request
  var formData = new FormData();
 
  // loop through all the selected files and add them to the formData object
  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    // add the files to formData object for the data payload
    formData.append('uploads[]', file, file.name);
  }

  $.ajax({
    url: `/upload/${author}`,
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function(data){
        console.log('upload successful!\n' + data);
    },
    xhr: function() {
      // create an XMLHttpRequest
      var xhr = new XMLHttpRequest();

      // listen to the 'progress' event
      xhr.upload.addEventListener('progress', function(evt) {

        if (evt.lengthComputable) {
          // calculate the percentage of upload completed
          var percentComplete = evt.loaded / evt.total;
          percentComplete = parseInt(percentComplete * 100);

          // update the Bootstrap progress bar with the new percentage
          $('.progress-bar').text(percentComplete + '%');
          $('.progress-bar').width(percentComplete + '%');

          // once the upload reaches 100%, set the progress bar text to done
          if (percentComplete === 100) {
            $('.progress-bar').html('Done');
          }

        }

      }, false);

      return xhr;
    }
  });

}
});
