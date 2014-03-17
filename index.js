exports.util = {
	polyfill: require('util.polyfill'),
	animate: require('util.animate'),
	colour: require('util.colour'),
	easing: require('util.easing'),
	log: require('util.log'),
	number: require('util.number'),
	object: require('util.object'),
};
exports.dom = {
	classlist: require('dom.classlist'),
	css: require('dom.css'),
	element: require('dom.element'),
	ready: require('dom.ready'),
	select: require('dom.select'),
	text: require('dom.text')
};
exports.environment = {
	capabilities: require('env.capabilities'),
	platform: require('env.platform'),
	viewport: require('env.viewport')
};
exports.events = {
	event: require('events.event')
};
