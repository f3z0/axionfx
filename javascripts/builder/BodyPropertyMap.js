define(function() {
	return {
		pos: {type: 'posvector'},
		posX: {type: 'number'},
		posY: {type: 'number'},
		mass: {type: 'unsignednumber'},
		force: {type: 'number'},
		splineAnchorPts: {type: 'pointlist'},
		splineIsPath: {type: 'boolean'},
		splineClockwise: {type: 'boolean'},
		splineSpeed: {type: 'unsignednumber'},
		splineRelForceOn: {type: 'boolean'},
		actsOn: {type: 'actsOn'},
		startDelay: {type: 'unsignednumber', params: [0,10000]}
	};
});

