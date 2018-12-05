import React, { Component } from 'react';
require('../styles/Loader.scss');

class Loader extends Component {

    render() {
        return (
            <div className="loader">
                <div className="logo"/>
            </div>
        );
    }
}

export default Loader;