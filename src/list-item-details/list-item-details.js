import React, { Component } from 'react';
import { getToken, getClientSecret, getClientId, getApiUrlBase } from '../config/config';
import axios from 'axios';
import Error from '../error/error';
import './list-item-details.css';
import { Link } from 'react-router-dom';
import Loader from '../loader/loader';

class ListItemDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: undefined,
            search: '',
            showLoader: false,
            user: this.props.match.params.user,
            repo: this.props.match.params.repo,
            error: { status: false, message: '' }
        }
        this.loadCommits = this.loadCommits.bind(this);
        this.searchInCommits = this.searchInCommits.bind(this);
        localStorage.setItem('user', this.state.user);
    }

    getUserRepoCommits() {
        return `${getApiUrlBase()}/repos/${this.state.user}/${this.state.repo}/commits?client_secret=${getClientSecret()}&client_id=${getClientId()}&per_page=20`;
    }

    searchInCommits(term) {
        return `${getApiUrlBase()}/search/commits?q=repo:${this.state.user}/${this.state.repo}+${term}&client_secret=${getClientSecret()}&client_id=${getClientId()}`;
    }

    loadCommits() {
        let error = { ...this.state.error };
        axios.get(this.getUserRepoCommits()).then(res => {
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

    loadCommitsFromSearch(term) {
        this.showLoader();
        let error = { ...this.state.error };
        axios.get(this.searchInCommits(term), {
            headers: {
                Accept: 'application/vnd.github.cloak-preview'
            }
        }).then(res => {
            console.log(res)
            if(res.status === 200) {
                let list = res.data.items;

                if(list.length > 0) {
                    this.setState({ ...this.state, list });
                } else {
                    error.status = true;
                    error.message = 'Nenhum resultado';
                    this.setState({ ...this.state, list: undefined, error });
                }
            } else {
                error.status = true;
                error.message = 'Ocorreu um erro, por favor tente novamente';
                this.setState({ ...this.state, list: undefined, error: { status: false, message: '' } });
            }
            this.hideLoader();
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

    formatDate(d) {
        let date = new Date(d);
        return ((date.getMonth()+1) + '/' + date.getDate() + '/' +  date.getFullYear());
    }

    keyHandler = (e) => {
		if(e.key === 'Enter') {
			this.loadCommitsFromSearch(this.state.search);
		}
    }

    handleChange(e) {
        this.setState({ ...this.state, search: e.target.value });
    }

    resetSearch() {
        this.setState({ ...this.state, search: '', list: undefined, error: { status: false, message: '' }  });
        this.loadCommits();
    }

    componentWillMount() {
        this.loadCommits();
    }

	render() {
		return (
			<div className="commits-container">
                <h6 className="float-left">Commits do repositório: {this.state.user}/{this.state.repo}</h6>
                <Link to="/" className="float-right">Voltar</Link>
                <div className="clearfix"></div>
                <hr />
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Buscar nos commits" value={this.state.search} onKeyUp={this.keyHandler} onChange={(e) => this.handleChange(e)} />
                </div>
                <div className="row">
                    <div className="col form-group">
                        <button className="btn btn-danger btn-block" type="button" onClick={() => this.resetSearch()}>Resetar</button>
                    </div>
                    <div className="col form-group">
                        <button className="btn btn-primary btn-block" type="button" onClick={() => this.loadCommitsFromSearch(this.state.search)}>Buscar</button>
                    </div>
                </div>
                <hr/>
                <ul className="list-group">
                    {this.state.list && !this.state.error.status ? this.state.list.map(c => (
                        <li className="list-group-item" key={c.sha}>
                            {c.commit.message}
                            <span className="badge badge-primary badge-pill float-right">{this.formatDate(c.commit.author.date)}</span>
                        </li>
                    )) : null}
                </ul>
                { this.state.showLoader ? <Loader/> : null }
                { this.state.error.status ? <Error message={this.state.error.message} /> : null }
            </div>
		);
	}
}

export default ListItemDetails;
