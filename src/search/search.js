import React, { Component } from 'react';
import { getToken, getClientSecret, getClientId, getApiUrlBase } from '../config/config';
import axios from 'axios';
import List from '../list/list';
import Error from '../error/error';
import Loader from '../loader/loader';
import './search.css';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = this.getDefaultState();
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.resetSearch = this.resetSearch.bind(this);
        this.showLoader = this.showLoader.bind(this);
        this.hideLoader = this.hideLoader.bind(this);
    }

    getDefaultState = () => {
        return {
            user: localStorage.getItem('user') || '',
            showLoader: false,
            list: undefined,
            error: { status: false, message: '' }
        }
    }

    getUserRepos(user) {
        return `${getApiUrlBase()}/users/${user}/repos?client_secret=${getClientSecret()}&client_id=${getClientId()}&type=public&sort=updated`;
    }

    handleSearch = async () => {
        this.resetSearch();
        this.showLoader();
        let error = { ...this.state.error };
        await axios.get(this.getUserRepos(this.state.user)).then(res => {
            this.resetSearch();
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
            this.hideLoader();
        });
    }

    showLoader() {
        this.setState({ ...this.state, showLoader: true });
    }

    hideLoader() {
        this.setState({ ...this.state, showLoader: false });
    }

    handleChange(e) {
        this.setState({ ...this.state, user: e.target.value });
    }

    resetSearch() {
        localStorage.removeItem('user');
        this.setState(this.getDefaultState());
    }

    keyHandler = (e) => {
		if(e.key === 'Enter') {
			this.handleSearch();
		}
    }

    componentWillMount() {
        if(this.state.user !== '') {
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
                { this.state.showLoader ? <Loader/> : null }
                { this.state.list && !this.state.error.status ? <List list={this.state.list} /> : null }
                { this.state.error.status ? <Error message={this.state.error.message} /> : null }
            </div>
        )
    }
}