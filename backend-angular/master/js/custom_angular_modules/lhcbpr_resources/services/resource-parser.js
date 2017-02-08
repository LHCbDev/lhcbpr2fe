lhcbprResourcesModule.service('resourceParser', function() {
  /**
   * This service is designed to make parsing resources easier.
   *
   * What is a resource? When the LHCbPRBE api is queried with
   * .all('compare'), it returns resource objects. These contain information
   * about a specific database entry and information about which jobs (out of
   * those requested) contain that resource. None of the jobs specified have
   * that resource (e.g. a file, or a number) then that resource is not
   * returned by the api.
   *
   * In short, if the api gives you a resource, at least one of the jobs you
   * requested has that resource.
   *
   * Since the resource object is necessarily complicated, these functions aid
   * the programmer in getting information out of the resource object. They
   * should each be documented with an expected output. If the output from
   * applying one of these functions on *any* resource object is different
   * from the documentation, this is a bug (either in docs or in the code).
   */

  this.getCommonValue = function(resource) {
    /**
     * Get single common value from resource. If more than one value (or no
     * value) is found, log it and return undefined.
     */
    var i;
    var values = [];
    for(i in resource.jobvalues) {
      values.push(resource.jobvalues[i].value);
    }
    var value = values.reduce(function(a, b) {
      if(undefined !== a && a === b) {
        return a;
      } else {
        console.error("The given resource contains non-identical values for each"
                      + " job! If this was expected, please use resourceParser.getValues.");
        return undefined;
      }});
    return value;
  };

  this.getValues = function(resource) {
    /**
     * Get all values from resource. If no values are found, return undefined.
     */
    var i;
    var values = [];
    for(i in resource.jobvalues) {
      values.push({
        jobId: resource.jobvalues[i].job.id,
        value: resource.jobvalues[i].value
      });
    }
    if(values.length < 0) {
      return values;
    } else {
      return undefined;
    }
  };

  this.getJobIds = function(resource) {
    /**
     * Return array of job ids or undefined.
     */
    var i;
    var jobIds = [];
    for(i in resource.jobvalues) {
      jobIds.push(resource.jobvalues[i].job.id);
    }
    if(jobIds.length > 0) {
      return jobIds;
    } else {
      console.error("This resource does not contain any jobs!");
      return undefined;
    }
  };

  this.getType = function(resource) {
    return resource.dtype;
  };

});


// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
