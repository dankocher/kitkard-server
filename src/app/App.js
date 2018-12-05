import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import {G} from './globals';
import Loader from './screens/Loader';
import Welcome from './screens/Welcome';

import './App.css';
require('./styles/app.scss');

class App extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props) {
        super(props);

        const { cookies } = props;
        this.state = {
            __session: cookies.get(G.session_name) || null,
            modules: [],
            current: "Loader"

        };
    }

    checkSession() {
        if (this.state.__session !== null) {
            fetch(G.host+'/api/user', {
                method: "GET",
                body: JSON.stringify({[G.session_name]: this.state.__session})
            }).then(res => {
                //TODO: is is logged go home, else goto login
                console.log(res);
            })
        } else {
            this.showScreen("Welcome");
        }
    };

    componentWillMount() {
        this.checkSession();
    }

    showScreen(__screen) {
        this.setState({
            current: __screen
        })
    }

    handleSession = async (session) => {

        if (session !== undefined) {
            const {cookies} = this.props;
            const session_name = G.session_name;
            cookies.set(session_name, session, {path: '/'});
            await this.setState({__session: session_name});
            //TODO: show home
        } else {
            this.showScreen("login")
        }
    };

    getCurrentScreen() {
        switch (this.state.current.toLowerCase())
        {
            case "loader": return <Loader/>;
            case "welcome": return <Welcome/>;
        }
    }

    render() {
        return (
            <div className="App">
                {this.getCurrentScreen()}
            </div>
        );
    }
}

export default withCookies(App);
