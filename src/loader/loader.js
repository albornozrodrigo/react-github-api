import React, { Component } from 'react';
import './loader.css';

class Loader extends Component {
	render() {
		return (
            <div className="text-center">
			    <img className="loader" src="/assets/img/loader.gif" />
            </div>
		);
	}
}

export default Loader;