import React, { Component } from 'react';

import kitkard_white from '../images/kitkard_white.svg';
require('../styles/app.scss');

const Header = () => (
    <React.Fragment>
      <div className="header">
        <div className="logo">
            <img src={kitkard_white} alt="Kitkard"/>
        </div>
      </div>
    </React.Fragment>
  );

export default Header;