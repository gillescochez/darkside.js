darkside.removeAll('/demos/darkside');
darkside.write('foo', 'foo');

darkside.write('array', ['a','b']);
darkside.write('object', {
	a:'a',
	b:'b'
});


var pairs = darkside.pairs();
console.log(pairs, darkside);