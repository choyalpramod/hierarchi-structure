import React from 'react';
import './index.scss';
import AddOrEditNodes from './AddOrEditNodes';

export default class Hierarchi extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = ({
            hierarchi: this.getNewData(this.props.data),
            addOrEdit: null
        });
    }

    render() {
        console.log('render ',this.state.hierarchi);
        return(
            <React.Fragment>
                {this.structureRendering([this.props.root])}
                {this.state.addOrEdit &&
                    <AddOrEditNodes 
                        callback={this.callbackUpdate.bind(this)} 
                        option={this.state.addOrEdit.data}
                        parentKey={this.state.addOrEdit.parentKey}
                        originalData={this.state.hierarchi}/>
                }
            </React.Fragment>
        )
    }

    structureRendering(keys, parentKey = null){
        if(!keys){ return null; }
        let nextKey = null, keyParent;

        return(
            <React.Fragment>
                <div className="full-width">
                {keys.map((value, index)=>{
                    let obj = this.state.hierarchi[value], showChildren = false; 
                    if(!nextKey && (obj.show == true)){
                        nextKey = obj.children;
                        showChildren = true;
                        keyParent = value;
                    }
                    return this.getComponent(obj, showChildren, parentKey);
                })}
                </div>
                {this.structureRendering(nextKey, keyParent)}
            </React.Fragment>
        )
    }

    addOrEditBlock(){

    }

    getChildrenCount(key){
        let count = 0;
        if(this.state.hierarchi[key].children){
            count = this.state.hierarchi[key].children.length;
            this.state.hierarchi[key].children.map((value, index)=>{
                count += this.getChildrenCount(value); 
            });
        }
        return count;
    }

    callbackUpdate(newObj, parentKey){
        let hierarchi = JSON.parse(JSON.stringify(this.state.hierarchi));
        if(!hierarchi[newObj.key]){
            console.log(parentKey, hierarchi[parentKey]);
            if(!hierarchi[parentKey].children){
                hierarchi[parentKey].children = [];
            }
            hierarchi[parentKey].children.push(newObj.key);
        }
        hierarchi[newObj.key] = newObj;
        this.setState({
            hierarchi: hierarchi,
            addOrEdit: null 
        });
    }

    getComponent(object, showChildren = false, parentKey){
        let faClassName = 'fa ' + ((showChildren == true) ? 'fa-minus-circle' : 'fa-plus-circle');
        return(
            <div className="cursor-pointer" key={object.key}>
                <div 
                    className="padding-small font-bold"
                    onClick={this.hideOrShow.bind(this, object.key, parentKey)}>
                    {object.teamName}
                </div>
                <div className="padding-small" onClick={this.hideOrShow.bind(this, object.key, parentKey)}>
                    <div className="person-name">{object.personName}</div>
                    <div className="designation">{object.designation}</div>
                </div>
                <div className="" onClick={this.hideOrShow.bind(this, object.key, parentKey)}>
                    <div>{(object.children && object.children.length) ? object.children.length : 0}</div>
                    <div>{this.getChildrenCount(object.key)}</div>
                    {(object.children && object.children.length > 0) &&
                        <div>
                            <i className={faClassName}></i>
                        </div>
                    }
                </div>
                <div className="">
                    <div className="" onClick={this.onAdd.bind(this, object.key, parentKey)}><i className="fa fa-user-plus"></i></div>
                    {(object.key != this.props.root) && 
                        <div className="" onClick={this.onEdit.bind(this, object.key, parentKey)}><i className="fa fa-pencil"></i></div>                    
                    }
                    {(object.key != this.props.root) && 
                        <div className="" onClick={this.onDelete.bind(this, object.key, parentKey)}>
                            <i className="fa fa-trash"></i>
                        </div>                    
                    }
                </div>
            </div>
        )
    }

    onDelete(key, parentKey){
        console.log('onDelete');
        let hierarchi = this.state.hierarchi;
        let index = hierarchi[parentKey].children.indexOf(key);
        hierarchi[parentKey].children.splice(index, 1);
        delete hierarchi[key];
        this.setState({hierarchi: hierarchi});
    }

    onEdit(key, parentKey){
        console.log('onEdit ',key, parentKey);
        this.setState({
            addOrEdit: {
                data: this.state.hierarchi[key] || {},
                parentKey: parentKey
            }
        });
    }
    
    onAdd(key){
        console.log('onAdd ',key);
        this.setState({
            addOrEdit: {
                data: {},
                parentKey: key
            }
        });
    }
    
    hideOrShow(key, parentKey){
        console.log('onHideOrShow');
        let hierarchi = this.state.hierarchi;
        if(!(hierarchi[key].children && hierarchi[key].children.length > 0)){
            return null;
        }
        if(hierarchi[key].show == false){
            if(key != this.props.root){
                hierarchi[parentKey].children.map((value, index)=>{
                    hierarchi[value].show = false;
                });
            }
            hierarchi[key].show = true;
        }   
        else{
            hierarchi[key].show = false;            
        }   
        this.setState({hierarchi: hierarchi});
    }

    getNewData(data){
        let hierarchi = JSON.parse(JSON.stringify(data));
        for(let elem in hierarchi){
            hierarchi[elem].show = false;
        }

        return this.setFirstElemShow(hierarchi);
    }

    setFirstElemShow(data, key = null){
        if(!key){
            key = this.props.root;
        }
        data[key].show = true;
        if(data[key].children && data[key].children.length > 0){
            return this.setFirstElemShow(data, data[key].children[0]);
        }
        return data;
    }
}