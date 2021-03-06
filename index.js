exports.dom = {
	classlist: require('dom.classlist'),
	style: require('dom.style'),
	element: require('dom.element'),
	ready: require('dom.ready'),
	select: require('dom.select'),
	text: require('dom.text')
};

exports.env = {
	capabilities: require('env.capabilities'),
	platform: require('env.platform'),
	viewport: require('env.viewport')
};

exports.events = {
	event: require('events.event')
};

exports.util = {
	polyfill: require('util.polyfill'),
	animate: require('util.animate'),
	colour: require('util.colour'),
	ease: require('util.ease'),
	log: require('util.log'),
	number: require('util.number'),
	identify: require('util.identify'),
	object: require('util.object'),
	svg: require('util.svg')
};
