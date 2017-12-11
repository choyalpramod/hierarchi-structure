import React from 'react';
import Hierarchi from '../../section/components/Hierarchi';
import * as constants from '../../section/constants/constants';

export default class Home extends React.Component {

    constructor(props){
        super(props);
    }
    render() {
        return(
            <div className="full-width">
                <Hierarchi 
                    data={constants.hierarchi} 
                    root={constants.hierarchiRootKey} />
            </div>
        )
    }
}