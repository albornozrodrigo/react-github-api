import React, { Component } from 'react';
import { getToken, getApiUrlBase } from '../config/config';
import axios from 'axios';
import Error from '../error/error';

export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            error: { status: false, message: '' }
        }
        this.loadCommits = this.loadCommits.bind(this);
    }

    getUserRepoCommits(repo) {
        return `${getApiUrlBase()}/repos/${repo.owner.login}/${repo.name}/commits?access_token=${getToken()}&per_page=20`;
    }

    loadCommits(repo) {
        console.log(repo);
        axios.get(this.getUserRepoCommits(repo)).then(res => {
            console.log(res)
        });
    }

    render() {
        return (
            <div className="list-container">
                <ul className="list-group">
                    {this.state.list.map(repo => (
                        <button key={repo.id} className="list-group-item list-group-item-action" type="button" onClick={() => this.loadCommits(repo)}>{repo.name}</button>
                    ))}
                </ul>
                { this.state.error.status ? <Error message={this.state.error.message} /> : null }
            </div>
        )
    }
}