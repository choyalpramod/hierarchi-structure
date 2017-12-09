import React from 'react';
import Hierarchi from '../../section/components/Hierarchi';

export default class Home extends React.Component {

    constructor(props){
        super(props);
    }
    render() {
        return(
            <div>
                <Hierarchi />
            </div>
        )
    }
}