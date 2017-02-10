lhcbprPlotModule.service('rootFileFinder', function() {
    this.get = function(jobId, fileName) {
        /**
         * Get the filename of a ROOT file given a job and root filename
         *
         * TODO include error checking here, checking that the file actually exists in this job.
         */
        return jobId + "/" + fileName;
    };
});


lhcbprPlotModule.service('arrangeRootFiles', ['rootFileFinder', function(rootFileFinder) {
    this.arrangeByJobId = function(jobIds, files) {
        /**
         * Arranges files into an object based on jobIds and files e.g.
         *
         * jobIds = [2, 3]; files = ['abc.root', 'def.root']
         *
         * becomes...
         *
         * {
         *   2: ['2/abc.root', '2/def.root'],
         *   3: ['3/abc.root', '3/def.root']
         * }
         */
        var filesPerJobId = {};
        var i, j;
        for(i in jobIds) {
            filesPerJobId[jobIds[i]] = [];
            for(j in files) {
                var file = rootFileFinder.get(jobIds[i], files[j]);
                // TODO eventually, rootFileFinder will actually check if the file
                // exists. For now, it just guesses where it thinks it is.
                if(file) {
                    filesPerJobId[jobIds[i]].push(file);
                }
            }
        }
        return filesPerJobId;
    };

    this.arrangeByFileName = function(jobIds, files) {
        /**
         * Arranges files into an object based on jobIds and files e.g.
         *
         * jobIds = [2, 3]; files = ['abc.root', 'def.root']
         *
         * becomes...
         *
         * {
         *   'abc.root': ['2/abc.root', '3/abc.root'],
         *   'def.root': ['2/def.root', '3/def.root']
         * }
         */
        var filesPerFileName = {};
        var i, j;
        for(i in files) {
            filesPerFileName[files[i]] = [];
            for(j in jobIds) {
                var file = rootFileFinder.get(jobIds[j], files[j]);
                // TODO eventually, rootFileFinder will actually check if the file
                // exists. For now, it just guesses where it thinks it is.
                if(file) {
                    filesPerFileName[files[i]].push(file);
                }
            }
        }
        return filesPerFileName;
    };
}]);
