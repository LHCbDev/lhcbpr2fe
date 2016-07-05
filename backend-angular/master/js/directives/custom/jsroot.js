App.directive('rootjs', function($timeout) {
  JSROOT.source_dir = 'app/vendor/jsroot/';
  return {
    restrict: 'E',
    scope: {
      data: '=',
      width: '@',
      height: '@'
    },
    template: '<div ng-style="{\'width\': width, \'height\': height}"></div>',
    link: function(scope, element) {

      scope.$watch('data', function(values) {
      	if(!values) return;
        try {
          scope.json = [];
          for ( key in values ) {
            if (angular.isObject(values[key])) {
              scope.json.push(values[key]);
            } else {
            	scope.json.push(angular.fromJson(values[key]));
            }
          }
          var obj = [];
          var pad = element.children()[0];
          for ( key in scope.json ) {
            obj.push(JSROOT.JSONR_unref(scope.json[key]));
          }  
          var canvas = null;
          if ( obj[0]._typename != 'TCanvas') {
            var primitives = [obj[0]];
          	if (obj[0]._typename == "TMultiGraph" ) {
             	primitives.push(createLegend(obj[0]));
            } else {
              //_.forEach(obj, function(o) { o.fBits = 53608456; }); // Do not display title
              primitives = obj;
            }
	          canvas = createCanvas(primitives);
	          if (obj[0]._typename != "TMultiGraph" && obj.length == 2 ) {
	            var ks = 0;
	            if ( obj[0]._typename.slice(0,3) == "TH1" ) {
                ks = KolmogorovTestTH1(obj[0], obj[1]);
                canvas.fFillColor = evalKtest( ks );
	              _.forEach(obj, function(o) { o.fTitle = "Kolmogorov test result: " + ks; })       
	            } else if ( obj[0]._typename.slice(0,3) == "TH2" ) {
	              /*
                ks = KolmogorovTestTH2(obj[0], obj[1]);
                canvas.fFillColor = evalKtest( ks );
	              _.forEach(obj, function(o) { o.fTitle = "Kolmogorov test result: " + ks; })   	            
	              */
	              console.log("Sorry for TH2 js is too slow...");  
		            canvas.fFillColor = 0;
	              _.forEach(obj, function(o) { o.fTitle = "Kolmogorov test not applied"; })
	            }              
	          }
          } else {
	          canvas = obj[0];
	        }
          pad.innerHTML = "";
          $timeout(function() {JSROOT.draw(pad, canvas)},2);
          
        } catch (ex) {
          console.log('rootjs directive: ' + ex);
        }
      });
    }
  };

  function createLegend(obj) {
    var legend = JSROOT.JSONR_unref({
      '_typename': 'TLegend',
      'fUniqueID': 0,
      'fBits': 50331657,
      'fLineColor': 1,
      'fLineStyle': 1,
      'fLineWidth': 1,
      'fFillColor': 0,
      'fFillStyle': 1001,
      'fX1': 0.75,
      'fY1': 0.85,
      'fX2': 0.99,
      'fY2': 0.99,
      'fX1NDC': -2.353437e-185,
      'fY1NDC': -2.353437e-185,
      'fX2NDC': -2.353437e-185,
      'fY2NDC': -2.353437e-185,
      'fBorderSize': 1,
      'fInit': 0,
      'fShadowColor': 1,
      'fCornerRadius': 0,
      'fOption': 'brNDC',
      'fName': 'TPave',
      'fTextAngle': 0,
      'fTextSize': 0,
      'fTextAlign': 12,
      'fTextColor': 1,
      'fTextFont': 42,
      'fEntrySeparation': 1.000000e-01,
      'fMargin': 2.500000e-01,
      'fNColumns': 1,
      'fColumnSeparation': 0
    });
    var lst = JSROOT.CreateTList();
    _.forEach(obj.fGraphs.arr, function(p) {
      lst.Add(createTLegendEntry(p.fTitle, p.fLineColor));
    });

    legend.fPrimitives = lst;
    return legend;
  }

  function createCanvas(objArr) {
    var canvas = JSROOT.JSONR_unref({
      '_typename': 'TCanvas',
      'fUniqueID': 0,
      'fBits': 53673992,
      'fLineColor': 1,
      'fLineStyle': 1,
      'fLineWidth': 1,
      'fFillColor': 0,
      'fFillStyle': 1001,
      'fLeftMargin': 0.1,
      'fRightMargin': 0.1,
      'fBottomMargin': 0.1,
      'fTopMargin': 0.1,
      'fXfile': 2,
      'fYfile': 2,
      'fAfile': 1,
      'fXstat': 0.99,
      'fYstat': 0.99,
      'fAstat': 2,
      'fFrameFillColor': 0,
      'fFrameLineColor': 1,
      'fFrameFillStyle': 1001,
      'fFrameLineStyle': 1,
      'fFrameLineWidth': 1,
      'fFrameBorderSize': 1,
      'fFrameBorderMode': 0,
      'fX1': 0,
      'fY1': 0,
      'fX2': 1,
      'fY2': 1,
      'fXtoAbsPixelk': 0.00005,
      'fXtoPixelk': 0.00005,
      'fXtoPixel': 698,
      'fYtoAbsPixelk': 475,
      'fYtoPixelk': 475,
      'fYtoPixel': -475,
      'fUtoAbsPixelk': 0.00005,
      'fUtoPixelk': 0.00005,
      'fUtoPixel': 698,
      'fVtoAbsPixelk': 475,
      'fVtoPixelk': 475,
      'fVtoPixel': -475,
      'fAbsPixeltoXk': 0,
      'fPixeltoXk': 0,
      'fPixeltoX': 0.001432665,
      'fAbsPixeltoYk': 1,
      'fPixeltoYk': 0,
      'fPixeltoY': -0.002105263,
      'fXlowNDC': 0,
      'fYlowNDC': 0,
      'fXUpNDC': 0,
      'fYUpNDC': 0,
      'fWNDC': 1,
      'fHNDC': 1,
      'fAbsXlowNDC': 0,
      'fAbsYlowNDC': 0,
      'fAbsWNDC': 1,
      'fAbsHNDC': 1,
      'fUxmin': 0,
      'fUymin': 0,
      'fUxmax': 1,
      'fUymax': 1,
      'fTheta': 30,
      'fPhi': 30,
      'fAspectRatio': 0,
      'fNumber': 0,
      'fTickx': 0,
      'fTicky': 0,
      'fLogx': 0,
      'fLogy': 0,
      'fLogz': 0,
      'fPadPaint': 0,
      'fCrosshair': 0,
      'fCrosshairPos': 0,
      'fBorderSize': 2,
      'fBorderMode': 0,
      'fModified': true,
      'fGridx': true,
      'fGridy': true,
      'fAbsCoord': false,
      'fEditable': true,
      'fFixedAspectRatio': false,
      'fExecs': null,
      'fTitle': 'multigraph',
      'fDISPLAY': '$DISPLAY',
      'fDoubleBuffer': 1,
      'fRetained': true,
      'fXsizeUser': 0,
      'fYsizeUser': 0,
      'fXsizeReal': 20,
      'fYsizeReal': 13.61032,
      'fWindowTopX': 0,
      'fWindowTopY': 45,
      'fWindowWidth': 700,
      'fWindowHeight': 500,
      'fCw': 698,
      'fCh': 475,
      'fCatt': {
        '_typename': 'TAttCanvas',
        'fXBetween': 2,
        'fYBetween': 2,
        'fTitleFromTop': 1.2,
        'fXdate': 0.2,
        'fYdate': 0.3,
        'fAdate': 1
      },
      'kMoveOpaque': true,
      'kResizeOpaque': true,
      'fHighLightColor': 5,
      'fBatch': true,
      'kShowEventStatus': false,
      'kAutoExec': true,
      'kMenuBar': true
    });

    var lst = JSROOT.Create("TList");
    _.forEach(objArr, function(o) { lst.Add(o);});
    canvas.fPrimitives = lst;
    return canvas;
  }

  function createTLegendEntry(title, color) {
    var entry = {
      '_typename': 'TLegendEntry',
      'fUniqueID': 0,
      'fBits': 50331648,
      'fTextAngle': 0,
      'fTextSize': 1,
      'fTextAlign': 0,
      'fTextColor': 0,
      'fTextFont': 0,
      'fLineColor': color,
      'fLineStyle': 1,
      'fLineWidth': 1,
      'fFillColor': 0,
      'fFillStyle': 0,
      'fMarkerColor': color,
      'fMarkerStyle': 21,
      'fMarkerSize': 1,
      'fLabel': title,
      'fOption': 'lpf'
    };
    return entry;
  }
  
  function Nint(x) {
    // Round to nearest integer. Rounds half integers to the nearest
    // even integer.
    var i;
    if (x >= 0) {
      i = Math.floor(x + 0.5);
      if ( i & 1 && x + 0.5 == i ) i--;
    } else {
      i = Math.ceil(x - 0.5);
      if ( i & 1 && x - 0.5 == i ) i++;
    }
    return i;
  }

  function KolmogorovProb(z) {
    var fj = [-2,-8,-18,-32];
    const w = 2.50662827;
    // c1 - -pi**2/8, c2 = 9*c1, c3 = 25*c1
    const c1 = -1.2337005501361697;
    const c2 = -11.103304951225528;
    const c3 = -30.842513753404244;
    
    var u = Math.abs(z);
    var p;
    if (u < 0.2) {
      p = 1;
    } else if (u < 0.755) {
      var v = 1./(u*u);
      var p = 1 - w*(Math.exp(c1*v) + Math.exp(c2*v) + Math.exp(c3*v))/u;
    } else if (u < 6.8116) {
      var r = [0, 0, 0, 0];
      var v = u*u;
      var maxj = Math.max(1,Nint(3.0/u));
      for (var j=0; j<maxj; j++) {
        r[j] = Math.exp(fj[j]*v);
      }
      p = 2*(r[0] - r[1] +r[2] - r[3]);
    } else {
      p = 0;
    }
    return p;
  }


  function KolmogorovTest(veca, vecb) {
    // vectors must be sorted
    var prob = -1;
    //      Require at least two points in each graph
    if (veca.length <= 2 || vecb.length <= 2) 
      return prob;
    //     Constants needed
    var rna = veca.length;
    var rnb = vecb.length;
    var sa  = 1./rna;
    var sb  = 1./rnb;
    var rdiff = 0;
    var rdmax = 0;
    var ia = 0;
    var ib = 0;
    
    //    Main loop over point sets to find max distance
    //    rdiff is the running difference, and rdmax the max.
    var ok = false;
    for (var i=0; i < veca.length+vecb.length; i++) {
      if (veca[ia] < vecb[ib]) {
        rdiff -= sa;
        ia++;
        if (ia >= veca.length) {ok = true; break;}
      } else if (veca[ia] > vecb[ib]) {
        rdiff += sb;
        ib++;
        if (ib >= vecb.length) {ok = true; break;}
      } else {
        // special cases for the ties
        var x = veca[ia];
        while(veca[ia] == x && ia < veca.length) {
          rdiff -= sa;
          ia++;
        }
        while(vecb[ib] == x && ib < vecb.length) {
          rdiff += sb;
          ib++;
        }
        if (ia >= veca.length) {ok = true; break;}
        if (ib >= vecb.length) {ok = true; break;}
      }
      rdmax = Math.max(rdmax,Math.abs(rdiff));
    }
    //    Should never terminate this loop with ok = false!
    if (ok) {
      rdmax = Math.max(rdmax,Math.abs(rdiff));
      var z = rdmax * Math.sqrt(rna*rnb/(rna+rnb));
      prob = KolmogorovProb(z);
    }

    return prob;
  }  


  function KolmogorovTestTH1(h1, h2) {
  
    var prob = 0;
    var ncx1 = h1.fNcells;
    var ncx2 = h2.fNcells;
 
    // Check consistency in number of channels
    if (ncx1 != ncx2) {
      console.log("ERROR: KolmogorovTest, number of channels is different: ", ncx1, ncx2);
      return 0;
    }
    
    // Check consistency in channel edges
    const difprec = 1e-5;
    var diff1 = Math.abs(h1.fXaxis.fXmin - h2.fXaxis.fXmin);
    var diff2 = Math.abs(h1.fXaxis.fXmax - h2.fXaxis.fXmax);
    if (diff1 > difprec || diff2 > difprec) {
      console.log("ERROR: KolmogorovTest, histograms with different binning");
      return 0;
    }
    
    var afunc1 = false;
    var afunc2 = false;
    var sum1 = 0, sum2 = 0;
    var ew1, ew2, w1 = 0, w2 = 0;
    var ifirst = 0;
    var ilast = ncx1-1;
/*
    for (var bin = ifirst; bin <= ilast; bin++) {
      sum1 += h1.getBinContent(bin);
      sum2 += h2.getBinContent(bin);
      ew1   = h1.getBinError(bin);
      ew2   = h2.getBinError(bin);
      w1   += ew1*ew1;
      w2   += ew2*ew2;
    }
*/    
    sum1 = h1.fTsumw;
    sum2 = h2.fTsumw;
    w1 = h1.fTsumw2;
    w2 = h2.fTsumw2;

    if (sum1 == 0) {
      console.log("ERROR: KolmogorovTest, histogram1 %s integral is zero", h1.fName);
      return 0;
    }
    if (sum2 == 0) {
      console.log("ERROR: KolmogorovTest, histogram2 %s integral is zero", h2.fName);
      return 0;
    }
    
    // calculate the effective entries.
    // the case when errors are zero (w1 == 0 or w2 ==0) are equivalent to
    // compare to a function. In that case the rescaling is done only on sqrt(esum2) or sqrt(esum1)
    var esum1 = 0, esum2 = 0;
    if (w1 > 0)
      esum1 = sum1 * sum1 / w1;
    else
      afunc1 = true;    // use later for calculating z
 
    if (w2 > 0)
      esum2 = sum2 * sum2 / w2;
    else
      afunc2 = true;    // use later for calculating z
  
    if (afunc2 && afunc1) {
      console.log("ERROR KolmogorovTest, errors are zero for both histograms");
      return 0;
    }
  
    var s1 = 1/sum1;
    var s2 = 1/sum2;
  
    // Find largest difference for Kolmogorov Test
    var  dfmax =0, rsum1 = 0, rsum2 = 0;
  
    for (var bin=ifirst; bin<=ilast; bin++) {
      rsum1 += s1*h1.getBinContent(bin);
      rsum2 += s2*h2.getBinContent(bin);
      dfmax = Math.max(dfmax,Math.abs(rsum1-rsum2));
    }
 
    // Get Kolmogorov probability
    var z;
    
    // case h1 is exact (has zero errors)
    if  (afunc1)
      z = dfmax*Math.sqrt(esum2);
      // case h2 has zero errors
    else if (afunc2)
      z = dfmax*Math.sqrt(esum1);
    else
      // for comparison between two data sets
      z = dfmax*Math.sqrt(esum1*esum2/(esum1+esum2));
 
    prob = KolmogorovProb(z);
    
    return prob;    
  }

  // evaluate the Kolmogorov test, return the color code for the canvas
  function evalKtest( val ) {
    if ( val >= 0.2 )
        return 8 // green
    else if ( val > 0.05 )
        return 5 // yellow
    else if ( val > 0 )
        return 2 // red
    else
        return 18 // gray
  }

  function KolmogorovTestTH2( h1, h2 ) {

    var prb = 0;
    
    var ncx1 = h1.fNcells;
    var ncx2 = h2.fNcells;
    var ncy1 = h1.fNcells; // not sure
    var ncy2 = h2.fNcells; // not sure
    
    // Check consistency in number of channels
    if (ncx1 != ncx2) {
      console.log("ERROR: KolmogorovTest, number of channels is different: ", ncx1, ncx2);
      return 0;
    }
    
    // Check consistency in channel edges
    const difprec = 1e-5;
    var diff1 = Math.abs(h1.fXaxis.fXmin - h2.fXaxis.fXmin);
    var diff2 = Math.abs(h1.fXaxis.fXmax - h2.fXaxis.fXmax);
    if (diff1 > difprec || diff2 > difprec) {
      console.log("ERROR: KolmogorovTest, histograms with different binning along X");
      return 0;
    }
    var diff1 = Math.abs(h1.fYaxis.fXmin - h2.fYaxis.fXmin);
    var diff2 = Math.abs(h1.fYaxis.fXmax - h2.fYaxis.fXmax);
    if (diff1 > difprec || diff2 > difprec) {
      console.log("ERROR: KolmogorovTest, histograms with different binning along Y");
      return 0;
    }
    
    var afunc1 = false;
    var afunc2 = false;
    var sum1 = 0, sum2 = 0;
    var w1 = 0, w2 = 0;
    var ibeg = 0, jbeg = 0;
    var iend = ncx1-1, jend = ncy1-1;
/*
    for (var i = ibeg; i <= iend; i++) {
      for (var j = jbeg; j <= jend; j++) {
        sum1 += h1.getBinContent(i,j);
        sum2 += h2.getBinContent(i,j);
        var ew1 = h1.getBinError(i,j);
        var ew2 = h2.getBinError(i,j);
        w1   += ew1*ew1;
        w2   += ew2*ew2;
      }
    }
*/
    sum1 = h1.fTsumw;
    sum2 = h2.fTsumw;
    w1 = h1.fTsumw2;
    w2 = h2.fTsumw2;
    
    //    Check that both scatterplots contain event
    if (sum1 == 0) {
      console.log("ERROR: KolmogorovTest, histogram1 %s integral is zero", h1.fName);
      return 0;
    }
    if (sum2 == 0) {
      console.log("ERROR: KolmogorovTest, histogram2 %s integral is zero", h2.fName);
      return 0;
    }

    // calculate the effective entries.
    // the case when errors are zero (w1 == 0 or w2 ==0) are equivalent to
    // compare to a function. In that case the rescaling is done only on sqrt(esum2) or sqrt(esum1)
    var esum1 = 0, esum2 = 0;
    if (w1 > 0)
      esum1 = sum1 * sum1 / w1;
    else
      afunc1 = true;    // use later for calculating z
 
    if (w2 > 0)
      esum2 = sum2 * sum2 / w2;
    else
      afunc2 = true;    // use later for calculating z
      
    if (afunc2 && afunc1) {
      console.log("ERROR KolmogorovTest, errors are zero for both histograms");
      return 0;
    } 
    
    // Nested fors are killing strategy for javascripts :( 

    //   Find first Kolmogorov distance
    var s1 = 1/sum1;
    var s2 = 1/sum2;
    var dfmax1 = 0;
    var rsum1=0, rsum2=0;
    for (var i=ibeg; i<=iend; i++) {
      for (var j=jbeg; j<=jend; j++) {
        rsum1 += s1*h1.getBinContent(i,j);
        rsum2 += s2*h2.getBinContent(i,j);
        dfmax1  = Math.max(dfmax1, Math.abs(rsum1-rsum2));
      }
    }

    //   Find second Kolmogorov distance
    var dfmax2 = 0;
    rsum1=0, rsum2=0;
    for (var j=jbeg; j<=jend; j++) {
      for (var i=ibeg; i<=iend; i++) {
        rsum1 += s1*h1.getBinContent(i,j);
        rsum2 += s2*h2.getBinContent(i,j);
        dfmax2 = Math.max(dfmax2, Math.abs(rsum1-rsum2));
      }
    }
  
    //    Get Kolmogorov probability: use effective entries, esum1 or esum2,  for normalizing it
    var factnm;
    if (afunc1)      factnm = Math.sqrt(esum2);
    else if (afunc2) factnm = Math.sqrt(esum1);
    else             factnm = Math.sqrt(esum1*sum2/(esum1+esum2));
 
    // take average of the two distances
    var dfmax = 0.5*(dfmax1+dfmax2);
    var z  = dfmax*factnm;
 
    prb = KolmogorovProb(z);

    return prob;    
  }

});

App.directive('rootjsserver', function($http) {
  return {
  restrict: 'E',
  scope: {
    entrypoint: '=',
    files: '=',
    items: '=',
    width: '@',
    height: '@'
  },
  template: '<rootjs data="data" width="{{width}}" height="{{height}}"></rootjs>',
  link: function(scope) {
    scope.$watchGroup(['files', 'items'], function(values) {
    	console.log('watch', values);
    	if(values[0] && values[1]) {
      	activate(values[0], values[1]);
    	}
    });

    ///
    function activate(files, items) {
      var strFiles = _.map(_.keys(files), encodeURIComponent).join('__');
      var url = scope.entrypoint + '/?files=' +
      strFiles +
      '&items=' + encodeURIComponent(items) +
      '&callback=JSON_CALLBACK';
      $http.jsonp(url).then(loaded, error);

    }

    function loaded(data) {
      var graph, mg, color;
      var graphs = [];
      var others = [];
      color = 1;
      _.forEach(data.data['result'], function(file) {
        _.forEach(file['items'], function(value, key) {
        	if(value['_typename'] == 'TGraph' || value['_typename'] == 'TGraphErrors'){
	          graph = JSROOT.JSONR_unref(value);
	          graph.fLineColor = color++;
	          graph.fTitle = scope.files[file.root] + ' ' + graph.fTitle;
	          graphs.push(graph);
          } else {
            other = JSROOT.JSONR_unref(value);
            other.fLineColor = color++;
            if ( scope.files[file.root] != "" ) {
              //other.fTitle = scope.files[file.root]; // used in Legend
              other.fName = scope.files[file.root];  // used in ToolTips
            }  
	          others.push(other);
          }
        });
      });

      if (others.length > 0) {
        scope.data = others;
      } else {
      	scope.data = JSROOT.CreateTMultiGraph.apply(this, graphs);
      }
    }

    function error(err) {
      console.error(err);
    }
  }
};
});



