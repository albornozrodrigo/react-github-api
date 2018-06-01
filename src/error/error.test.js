import React from 'react';
import ReactDOM from 'react-dom';
import Error from './error';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<Error message="Lorem ipsum dolor sit amet" />, div);
	ReactDOM.unmountComponentAtNode(div);
});