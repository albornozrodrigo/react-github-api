import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Search from '../search/search';
import ListItemDetails from '../list-item-details/list-item-details';

export default props => (
	<Router>
		<div>
			<Route exact path='/' component={Search} />
			<Route path='/details/:user/:repo' component={ListItemDetails} />
		</div>
	</Router>
)