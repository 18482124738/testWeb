import React from 'react';

import Header from './Header';

const BaseMineMenu = props => (
    <div className="wrapper">

        <Header />
    
        <section className="main-container">
            { props.children }
        </section>

    </div>
)

export default BaseMineMenu;
