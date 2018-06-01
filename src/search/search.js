import React, { Component } from 'react';
import { getToken, getApiUrlBase } from '../config/config';
import axios from 'axios';
import List from '../list/list';
import Error from '../error/error';
import './search.css';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = this.getDefaultState();
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.resetSearch = this.resetSearch.bind(this);
    }

    getDefaultState = () => {
        return {
            user: '',
            list: undefined,
            error: { status: false, message: '' }
        }
    }

    getUserRepos(user) {
        return `${getApiUrlBase()}/users/${user}/repos?access_token=${getToken()}&type=public&sort=updated`;
    }

    handleSearch = async () => {
        this.resetSearch();
        let error = { ...this.state.error };
        await axios.get(this.getUserRepos(this.state.user)).then(res => {
            console.log(res)
            if(res.status === 200) {
                let list = res.data;

                if(list.length > 0) {
                    this.setState({ ...this.state, list });
                }
            } else {
                error.status = true;
                error.message = 'Ocorreu um erro, por favor tente novamente';
                this.setState({ ...this.state, list: undefined, error });
            }
        }, err => {
            console.log(err);
            error.status = true;
            error.message = err.message || 'Ocorreu um erro, por favor tente novamente';
            this.setState({ ...this.state, list: undefined, error });
        });
    }

    handleChange(e) {
        this.setState({ ...this.state, user: e.target.value });
    }

    resetSearch() {
        this.setState(this.getDefaultState());
    }

    keyHandler = (e) => {
		if(e.key === 'Enter') {
			this.handleSearch();
		}
	}

    render() {
        return (
            <div className="search-container">
                <div className="form-group">
                    <label>Digite o nome do usuário do Github: </label>
                    <input className="form-control" type="text" placeholder="ex: albornozrodrigo" value={this.state.user} onKeyUp={this.keyHandler} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                    <button className="btn btn-primary btn-block" type="button" onClick={this.handleSearch}>Buscar</button>
                </div>
                { this.state.list ? <List list={this.state.list} /> : null }
                { this.state.error.status ? <Error message={this.state.error.message} /> : null }
            </div>
        )
    }
}