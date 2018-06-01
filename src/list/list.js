import React, { Component } from 'react';
import { getToken, getApiUrlBase } from '../config/config';
import axios from 'axios';
import Error from '../error/error';
import ListItemDetails from '../list-item-details/list-item-details';
import { Link } from 'react-router-dom';

export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            error: { status: false, message: '' }
        }
    }

    render() {
        return (
            <div className="list-container">
                <ul className="list-group">
                    {this.state.list.map(repo => (
                        <Link to={{pathname: '/details/' + `${repo.owner.login}/${repo.name}` }} key={repo.id} className="list-group-item">{repo.name}</Link>
                    ))}
                </ul>
                { this.state.error.status ? <Error message={this.state.error.message} /> : null }
            </div>
        )
    }
}