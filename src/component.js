var React = require('react');

var HelloMessage = React.createClass({displayName: "HelloMessage",
  render: function() {
    return React.createElement("h1", null, "Hello ", this.props.name);
  }
});

module.exports = HelloMessage;