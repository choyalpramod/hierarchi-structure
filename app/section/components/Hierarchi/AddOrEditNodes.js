import React from 'react';

export default class AddOrEditNodes extends React.Component{
    constructor(props){
        super(props);
        this.state = ({edit: this.props.option});
    }

    render(){
        let { teamName, personName, designation } = this.state.edit || {};
        return(
            <React.Fragment>
                <div className="add-edit-block">
                    <div className="header primary-bg-color padding-medium p-relative white-fg-color">
                        <span className="font-medium">Add/Edit</span> <i className="fa fa-times font-medium f-right cursor-pointer" onClick={()=>this.props.closeNodes()}></i>
                    </div>
                    <form className="padding-large" onSubmit={this.onSubmit.bind(this)}>
                        <span className="font-xsmall font-bold">Team Name</span>
                        <div><input type="text" onChange={(event)=>this.handleChange(event, 'teamName')} value={teamName || ''}/></div>
                        <span className="font-xsmall font-bold">Name</span>
                        <div><input type="text" onChange={(event)=>this.handleChange(event, 'personName')} value={personName || ''}/></div>
                        <span className="font-xsmall font-bold">Designation</span>
                        <div><input type="text" onChange={(event)=>this.handleChange(event, 'designation')} value={designation || ''}/></div>
                        <div className="text-align-right">
                            <button type="submit">Save</button>
                        </div>
                    </form>
                </div>
                <div className="white-modal" onClick={()=>this.props.closeNodes()}></div>
            </React.Fragment>
        )
    }

    handleChange(event, key){
        let obj = this.state.edit || {};
        obj[key] = event.target.value;
        this.setState({edit: obj});
    }

    onSubmit(event){
        event.preventDefault();
        let newObj = this.state.edit;
        if(!newObj.key){
            newObj.key = this.findKey();
            newObj.show = false;
        }
        this.props.callback(newObj, this.props.parentKey);
    }

    findKey(key = 0){
        let newKey = `idea_${key}`;
        if(this.props.originalData[newKey]){
            return this.findKey(++key);
        }
        return newKey;
    }
}