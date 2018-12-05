import React, { Component } from 'react';
require('../styles/Welcome.scss');

class Welcome extends Component {

    render() {
        return (
            <div className="welcome">
                <div className="background"/>
                <div className="form">
                    <div className="kitkard-logo"/>
                    <div className="sign-social">
                        <div className="social-title">
                            Sign with
                        </div>
                        <div className="social-buttons">
                            <div className="social-button sign-google"/>
                            <div className="social-button sign-facebook"/>
                        </div>
                    </div>
                    <div className="bottom-block">
                        <div className="bb login">Sign In with e-mail</div>
                        <div className="bb registration">Registration</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Welcome;