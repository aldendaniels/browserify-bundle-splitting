var React = require('react');
var HelloMessage = require('./component');
React.render(React.createElement(HelloMessage, {name: "World"}), document.body);