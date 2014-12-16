define(function() {
	return {
		splineAnchorPts: {type: 'pointlist'},
		splineIsPath: {type: 'boolean'},
		splineClockwise: {type: 'boolean'},
		splineSpeed: {type: 'unsignednumber', params: [1,1000]},
		splineRelForceOn: {type: 'boolean'},
		actsOn: {type: 'actsOn'}
	};
});

