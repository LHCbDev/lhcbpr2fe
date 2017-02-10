lhcbprResourcesModule.service('jobsHelper', function() {

    this.findAllRootFiles = function(attr) {
        var res = new Set();
        var i, j;
        for (i = 0; i < attr.length; i++) {
            let j;
            for (j = 0; j < attr[i].jobvalues.length; j++) {
                if ( attr[i].jobvalues[j].value.endsWith(".root") ) {
                    var file = attr[i].jobvalues[j].job.id + '/' + attr[i].jobvalues[j].value;
                    res.add(file);
                }
            }
        }

        return res;
    };

});

// Local Variables:
// js2-basic-offset: 2
// js-indent-level: 2
// indent-tabs-mode: nil
// End:
