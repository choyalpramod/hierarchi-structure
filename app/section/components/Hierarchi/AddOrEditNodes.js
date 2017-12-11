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
                    <div className="primary-bg-color padding-medium p-relative">
                        <span className="font-medium">Add/Edit</span> <i className="fa fa-times right-0 font-medium"></i>
                    </div>
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <span>Team Name</span>
                        <div><input type="text" onChange={(event)=>this.handleChange(event, 'teamName')} value={teamName || ''}/></div>
                        <span>Name</span>
                        <div><input type="text" onChange={(event)=>this.handleChange(event, 'personName')} value={personName || ''}/></div>
                        <span>Designation</span>
                        <div><input type="text" onChange={(event)=>this.handleChange(event, 'designation')} value={designation || ''}/></div>
                        <div className="text-align-right">
                            <button type="submit">Save</button>
                        </div>
                    </form>
                </div>
                <div className="modal"></div>
            </React.Fragment>
        )
    }

    handleChange(event, key){
        console.log('onChange ',key, event, event.target,event.target.value);
        let obj = this.state.edit || {};
        obj[key] = event.target.value;
        this.setState({edit: obj});
    }

    onSubmit(event){
        event.preventDefault();
        console.log('on Submit');
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