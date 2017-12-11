import React from 'react';
import './index.scss';
import AddOrEditNodes from './AddOrEditNodes';

export default class Hierarchi extends React.Component {
    constructor(props) {
        super(props);
        this.maxChild = 4;
        
        this.state = ({
            hierarchi: this.getNewData(this.props.data),
            addOrEdit: null
        });
    }

    render() {
        return(
            <React.Fragment>
                {this.structureRendering([this.props.root])}
                {this.state.addOrEdit &&
                    <AddOrEditNodes 
                        callback={this.callbackUpdate.bind(this)} 
                        option={this.state.addOrEdit.data}
                        parentKey={this.state.addOrEdit.parentKey}
                        closeNodes={this.closeAddOrEdit.bind(this)}
                        originalData={this.state.hierarchi}/>
                }
            </React.Fragment>
        )
    }

    structureRendering(keys, parentKey = null){
        if(!keys){ return null; }
        let nextKey = null, keyParent, showChildrenKey, parentObj;

        return(
            <React.Fragment>
                <div className="before-comp full-width text-align-center"><div className={`size-${keys.length}`}></div></div>
                <div className="full-width text-align-center comp-parent p-relative">
                {keys.map((value, index)=>{
                    let obj = this.state.hierarchi[value], showChildren = false; 
                    if(!nextKey && (obj.show == true)){
                        showChildren = true;
                        nextKey = this.getSlicedChildren(obj);
                        keyParent = value;
                        showChildrenKey = index;
                        parentObj = obj;
                    }
                    return this.getComponent(obj, showChildren, parentKey);
                })}
                {(parentObj && parentObj.children && parentObj.children.length > 4) && 
                    <div className="pagination">
                        {(parentObj.level != 0) &&
                            <div className="left" onClick={this.prevPage.bind(this, parentObj)}>
                                <i className="fa fa-arrow-left"></i>
                                <div>({parentObj.level * this.maxChild})</div>
                            </div>
                        }
                        {(parentObj.level != (Math.floor(parentObj.children.length/this.maxChild))) &&
                            <div className="right" onClick={this.nextPage.bind(this, parentObj)}>
                                <i className="fa fa-arrow-right"></i>
                                <div>({parentObj.children.length - ((parentObj.level + 1) * this.maxChild)})</div>
                            </div>
                        }
                    </div>
                }
                </div>
                {(nextKey && nextKey.length > 0) &&
                    <div className="after-comp full-width text-align-center">
                        <div className={`first-${showChildrenKey}-${keys.length}`}></div>
                        <div className={`last-${showChildrenKey}-${keys.length}`}></div>
                    </div>
                }
                {this.structureRendering(nextKey, keyParent)}
            </React.Fragment>
        )
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

    closeAddOrEdit(){
        this.setState({addOrEdit: null});
    }

    getComponent(object, showChildren = false, parentKey){
        let faClassName = 'blue-fg fa ' + ((showChildren == true) ? 'fa-minus-circle' : 'fa-plus-circle');
        return(
            <div className={"comp-block margin-medium no-vertical-margin display-inline " + (showChildren ? 'active' : '')} key={object.key}>
                {object.key != this.props.root && <div className="comp-line"><div className="line-child"></div></div> }
                <div className="text-align-center cursor-pointer hirarchi-comp-box-shadow">
                    <div 
                        className={"padding-medium font-bold font-small " + (showChildren ? 'hirarchi-comp-active' : 'hirarchi-box-bottom-border')}
                        onClick={this.hideOrShow.bind(this, object.key, parentKey)}>
                        {object.teamName}
                    </div>
                    <div className="padding-small hirarchi-box-bottom-border" onClick={this.hideOrShow.bind(this, object.key, parentKey)}>
                        <div className="font-small font-bold">{object.personName}</div>
                        <div className="font-xxsmall hirarchi-light-color">{object.designation}</div>
                    </div>
                    <div 
                        className="padding-medium no-horizontal-padding hirarchi-box-bottom-border divider" 
                        onClick={this.hideOrShow.bind(this, object.key, parentKey)}>
                        <div className="div-item font-xsmall"><i className="fa fa-users blue-fg"></i> {(object.children && object.children.length) ? object.children.length : 0}</div>
                        <div className="div-item font-xsmall"><i className="fa fa-user blue-fg"></i> {this.getChildrenCount(object.key)}</div>
                        {(object.children && object.children.length > 0) &&
                            <div className="div-item">
                                <i className={faClassName}></i>
                            </div>
                        }
                    </div>
                    <div className="padding-medium no-horizontal-padding divider">
                        <div className="div-item" onClick={this.onAdd.bind(this, object.key, parentKey)}><i className="fa fa-user-plus green-fg"></i></div>
                        {(object.key != this.props.root) && 
                            <div className="div-item" onClick={this.onEdit.bind(this, object.key, parentKey)}><i className="fa fa-pencil"></i></div>                    
                        }
                        {(object.key != this.props.root) && 
                            <div className="div-item" onClick={this.onDelete.bind(this, object.key, parentKey)}>
                                <i className="red-fg fa fa-trash"></i>
                            </div>                    
                        }
                    </div>
                </div>
                {showChildren && <div className="comp-line"><div className="line-child"></div></div> }                
            </div>
        )
    }

    onDelete(key, parentKey){
        let hierarchi = this.state.hierarchi;
        let index = hierarchi[parentKey].children.indexOf(key);
        hierarchi[parentKey].children.splice(index, 1);
        delete hierarchi[key];
        this.setState({hierarchi: hierarchi});
    }

    onEdit(key, parentKey){
        this.setState({
            addOrEdit: {
                data: this.state.hierarchi[key] || {},
                parentKey: parentKey
            }
        });
    }
    
    onAdd(key){
        this.setState({
            addOrEdit: {
                data: {},
                parentKey: key
            }
        });
    }
    
    hideOrShow(key, parentKey){
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
            hierarchi[elem].level = 0;
        }

        return this.setFirstElemShow(hierarchi);
    }

    setFirstElemShow(data, key = null){
        if(!key){
            key = this.props.root;
        }
        if(data[key].children && data[key].children.length > 0){
            data[key].show = true;
            return this.setFirstElemShow(data, data[key].children[0]);
        }
        return data;
    }

    getSlicedChildren(obj){
        if(!(obj.children && obj.children.length > 0)){
            return obj.children;
        }

        let startIndex = ((obj.level > 0) ? (obj.level * this.maxChild): 0);
        let endIndex = startIndex + this.maxChild;
        
        return obj.children.slice(startIndex, endIndex);
    }

    prevPage(obj){
        let hierarchi = this.state.hierarchi;
        --hierarchi[obj.key].level;
        this.setState({hierarchi: hierarchi});
    }
    nextPage(obj){
        let hierarchi = this.state.hierarchi;
        ++hierarchi[obj.key].level;
        this.setState({hierarchi: hierarchi});
    }
}