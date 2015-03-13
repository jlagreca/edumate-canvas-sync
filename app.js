var fs = require('fs');
var request = require('request');
var schedule = require('node-schedule');
var moment = require('moment');
var config = require('./config');

// schedule.scheduleJob(config.uploadSchedules.test, function(){
//   console.log('Running staff upload at: ' + moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
// });

// Add a way to check the status of the most recent upload before POSTing a CSV.
// i.e.:
//   1. GET zeroth object from /api/v1/accounts/self/sis_imports/
//   2. Check 'workflow_state' for the presence of 'created' / 'importing'
//   3. If present, wait x seconds, goto step 1.
//   4. If 'imported' then begin POSTing

function canvasUpload(dataset) {
  request.post({
    url: config.canvas.upload,
    headers: config.canvas.auth,
    formData: { attachment: fs.createReadStream(__dirname + '/csv/' + dataset + '.csv') }
  }, respond);
}

function respond(error, response, body) {
  if (!error && response.statusCode === 200) {
    var payload = JSON.parse(body);
    console.log('Success! Import running. (ID: ' + payload.id + ')');
    uploadStatus(payload.id);
  } else {
    console.log('Error: ' + error);
  }
}

function uploadStatus() {
  request.get({
      url: config.canvas.uploadStatus,
      headers: config.canvas.auth
    },
    function(error, response, body) {
      var payload = JSON.parse(body);
      var status = payload.sis_imports[0];

      switch(status.workflow_state) {
        case 'created':
        case 'importing':
          checkImport(status.id);
          break;

        case 'imported':
          console.log('Latest SIS upload completed successfully on ' + moment(status.ended_at).format('dddd, MMMM Do YYYY [at] h:mm:ss a.'));
          break;

        case 'imported_with_messages':
          console.log('Latest SIS upload completed with the following messages:' + '\n' + 'Processing warnings: ' + status.processing_warnings[1] + '\n' + 'Processing errors: ' + status.processing_errors[1]);
          break;

        case 'failed':
          console.log('Latest SIS upload failed on ' + moment(status.ended_at).format('dddd, MMMM Do YYYY [at] h:mm:ss a.'));
          break;

        case 'failed_with_messages':
          console.log('Latest SIS upload failed on ' + moment(status.ended_at).format('dddd, MMMM Do YYYY [at] h:mm:ss a.') + ' with the following message:' + '\n' + status.processing_errors[1]);
          break;
      }
    }
  );
}

function checkImport(id) {
  request.get({
      url: config.canvas.uploadStatus + id,
      headers: config.canvas.auth
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        var status = JSON.parse(body);
        console.log('Current SIS import (' + id + ') status: ' + status.workflow_state + ' | Progress: ' + status.progress + '%');
      } else {
        console.log('Error: ' + error);
      }
    }
  );
}

uploadStatus();

/*
canvasUpload('staff');
*/