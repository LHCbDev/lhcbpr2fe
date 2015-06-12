/**
 * Helper class for getting colors
 */
var Colors = function() {};

Colors.all = [];
Colors.indexes = {};

Colors.add = function(name, hex) {
	Colors.all.push(hex);
	Colors.indexes[name] = Colors.all.length - 1;
}

Colors.applyPercentage = function(hex, percentage) {
	if(percentage == 1)
		return hex;
	var rgb = [1, 3, 5];
	rgb = rgb.map(function(i){
		// console.log('percentage: ' + percentage);
		// console.log(i);
		i = parseInt(hex.substring(i, i + 2), 16);
		// console.log(i);
		i = parseInt(i * percentage);
		// console.log(i);
		i = Math.min(255, i);
		// console.log(i);
		i = Math.max(0, i);
		// console.log(i);
		i = i.toString(16);
		if(i.length < 2)
			i = '0' + i;
		// console.log(i);
		return i;
	});
	// console.log(rgb);
	return '#' + rgb.join('');
}

Colors.lighten = function(hex, percentage) {
	if(percentage === undefined)
		percentage = 0.25;
	return Colors.applyPercentage(hex, 1 + percentage);
}

Colors.darken = function(hex, percentage) {
	if(percentage === undefined)
		percentage = 0.25;
	return Colors.applyPercentage(hex, 1 - percentage);
}

Colors.get = function(id, percentage) {
	if(percentage === undefined)
		percentage = 1;
	if(typeof id === 'number'){
		return Colors.applyPercentage(Colors.all[id], percentage);
	} else {
		if(Colors.indexes[id] !== undefined){
			return Colors.applyPercentage(Colors.all[Colors.indexes[id]], percentage);
		} else {
			console.error('Colors: Unknown color name');
		}
	}
}

Colors.getDark = function(id) {
	return Colors.darken(Colors.get(id));
}

Colors.getLight = function(id) {
	return Colors.lighten(Colors.get(id));
}

Colors.add('blue', '#1748B4');
Colors.add('green', '#007303');
Colors.add('red', '#E21717');
Colors.add('orange', '#FF7400');
Colors.add('violet', '#B200F6');
Colors.add('brown', '#852300');
Colors.add('pink', '#FF0066');
Colors.add('yellow', '#FFCC00');
Colors.add('grey', '#999');
