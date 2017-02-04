import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main.jsx';

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(Main),
    document.getElementById('main')
  );
});
