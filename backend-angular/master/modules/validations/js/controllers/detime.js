App.controller('DetimeController',
  function ($scope, $http, lhcbprResourcesHelper, BUILD_PARAMS) {
    $scope.url = BUILD_PARAMS.url_root;
    $scope.analyze = function(jobIds) {
      lhcbprResourcesHelper.compare(jobIds, 'detailed_timing_in_volumes').then(processData);
    };

    function processData(result) {
      jobs_names = []
      summary_data_values = []
      summary_data_lables = []

      for (i = 0; i < result[0].jobvalues.length; i++) {
        var job = result[0].jobvalues[i].job;
        var job_name = 'Job' + job.id
                       + '-' + job.job_description.application_version.version
                       + '-' + job.platform.content;
        jobs_names.push(job_name)
        var job_data = JSON.parse(result[0].jobvalues[i].value);

        var data_values = [];

        var summary_block = job_data['summary_of_total_time_in_each_volume'];
        for (var key in summary_block) {
          data_values.push(summary_block[key][1]);
          // Lables are the same, so save them only once
          if (i == 0) {
            summary_data_lables.push(summary_block[key][0]);
          }
        }
        summary_data_values.push(data_values);
      }

      // Construct and send the request
      var request = $scope.url + '/hrtplot/?callback=JSON_CALLBACK'
                               + '&jobnames=' + jobs_names.join(',')
                               + '&values=' + summary_data_values.join(';')
                               + '&labels=' + summary_data_lables.join(',')
                               + '&title=' + 'Total time in each detector volume'
                               + '&xaxis=' + 'detector'
                               + '&yaxis=' + 'seconds';

      if (result[0].jobvalues.length > 1) {
        request += '&ratio=1&trend=1';
      }

      $http.jsonp(request).then(plotSummary, error);

      // Draw the particles timings
      var particles_timing_data = particle_data(result);
      var list_of_dets = [];
      var list_of_particles = [];
      var list_of_values = [];

      for (var key_det in particles_timing_data) {
        list_of_dets.push(key_det);

        var tmp_particles = [];
        var tmp_values = [];

        for (var key_part in particles_timing_data[key_det]) {
          tmp_particles.push(key_part);
          tmp_values.push(particles_timing_data[key_det][key_part][jobs_names[0]]);
        }

        list_of_particles.push(tmp_particles);
        list_of_values.push(tmp_values);
      }

      // Construct and send the request
      request = $scope.url + '/text2dhist/?callback=JSON_CALLBACK'
                           + '&values=' + list_of_values.join(';')
                           + '&xlabels=' + list_of_dets.join(';')
                           + '&ylabels=' + list_of_particles.join(';')
                           + '&title=' + 'Timing of particle groups per detector for ' + jobs_names[0];
                           // + '&xaxis=' + 'detector'
                           // + '&yaxis=' + 'particle group';

      $http.jsonp(request).then(plotParticlesTimings, error);
    }

    function plotSummary(data) {
      // Force to clear the containers for results
      document.getElementById('div_mainPlot').innerHTML = '';
      document.getElementById('div_ratioPlot').innerHTML = '';
      document.getElementById('div_trendPlot').innerHTML = '';

      // Draw the main histogram
      JSROOT.redraw('div_mainPlot', JSROOT.JSONR_unref(data.data.result));

      // Draw the ration plot if exists
      if (data.data.ratio) {
        JSROOT.redraw('div_ratioPlot', JSROOT.JSONR_unref(data.data.ratio));
      }

      // Draw the trend plot if exists
      if (data.data.trend) {
        JSROOT.redraw('div_trendPlot', JSROOT.JSONR_unref(data.data.trend));
      }
    }

    function plotParticlesTimings(data) {
      document.getElementById('div_particlesTiming').innerHTML = '';
      JSROOT.redraw('div_particlesTiming', JSROOT.JSONR_unref(data.data.result));
    }

    // Draw the 2D tables of particles timings per detector
    function particle_data(data) {
      var table_data = {};

      var particle_groups_names = ['e', 'pi', 'K', 'mu', 'gamma', 'opticalphoton', 'other'];

      // Define groups of particles
      var particle_groups = {
        'e+': particle_groups_names[0],
        'e-': particle_groups_names[0],
        'pi+': particle_groups_names[1],
        'pi-': particle_groups_names[1],
        'kaon+': particle_groups_names[2],
        'kaon-': particle_groups_names[2],
        'mu+': particle_groups_names[3],
        'mu-': particle_groups_names[3],
        'gamma': particle_groups_names[4],
        'opticalphoton': particle_groups_names[5]
      };

      // Create and populate the data structure to simplify plotting:
      // Detector -> Particle -> JobName -> value
      // - Single job only, no comparison across jobs required
      // - Group particles of interest
      var job = data[0].jobvalues[0].job;
      var job_name = 'Job' + job.id
                     + '-' + job.job_description.application_version.version
                     + '-' + job.platform.content;

      var job_data = JSON.parse(data[0].jobvalues[0].value);
      var block_name_prefix = 'timing_per_particle_type_in_';

      // Loop over detectors records
      for (var key_det in job_data) {
        if (key_det.startsWith(block_name_prefix)) {
          var det_name = key_det.replace(block_name_prefix, '')
          // Ignore the 'all' category - it equals to summary
          if (det_name == 'all') {
            continue;
          }

          if (typeof table_data[det_name] === 'undefined') {
            table_data[det_name] = Object();
          }

          // Loop over the particle groups names and create their records
          // This trick helps to maintain order across detectors
          for (var key_part in particle_groups_names) {
            table_data[det_name][particle_groups_names[key_part]] = Object();
            table_data[det_name][particle_groups_names[key_part]][job_name] = 0.;
          }

          // Loop over particles
          for (var key_part in job_data[key_det]) {
            var part = job_data[key_det][key_part];
            // Ignore the total time in this detector - already in the summary
            if (part[0] == det_name) {
              continue;
            }

            var part_name = '';
            if (part[0] in particle_groups) {
              part_name = particle_groups[part[0]];
            } else {
              part_name = particle_groups_names[6];
            }

            table_data[det_name][part_name][job_name] += Number(part[1]);
          }
        }
      }
      return table_data;
    }

    function error(err) {
      console.error(err);
    }

    function printThis(obj) {
      var holder = document.getElementById('debugpane');
      holder.innerHTML += JSON.stringify(obj, null, 2);
    }
});
