import React, { Component } from 'react'
import "./jobs.css";
import { Link } from 'react-router-dom';
import Watch from '../Files/Images/Watch.svg';
import Tick from '../Files/Images/tick.svg';
import { api , printError} from '../../services/';

class JobRecruiter extends Component {
constructor(props){
    super(props)

    this.state={
        fname:"Varun",
        lname:"Jain",
        company:"Sr Recruiter at Google",
        id:""
    }
    this.getRecruiter=this.getRecruiter.bind(this);

}

async getRecruiter(id){
if(id){

  try {
    let ret = await api('GET','/users/'+id);
    console.log(ret);
    this.setState({
      fname:ret.data.payLoad.user.name.first,
      lname:ret.data.payLoad.user.name.last,
      company:ret.data.payLoad.user.company
    })
  } catch (error) {
    console.log(Object.keys(error), error.response);
    printError(error);
  }

}else{
  return;
}
}


componentWillReceiveProps(nextProps){
  console.log("Props Will",nextProps.data);
 this.getRecruiter(nextProps.data)
}




  render() {
     console.log("Renderrrrr",this.state.id);
    return (
      <div>
<hr/>
      <label className="heading-location">
      Contact the Job Poster
      </label>
      <div>
      <div class="row">
            <div class="col-md-5 image-tick">
            <img id="target2" src={""} className="avatar img-circle img-thumbnail" alt="" />

            </div>
            <div class="col-md-6">
            <div>
            <label className="recuiter-name">{this.state.fname} &nbsp; {this.state.lname}</label><br/>
            </div>
            <br/>
            <div>
            <label style={{fontSize:"10px"}}>{this.state.company}</label>
            </div>
            </div>
            
            </div>
            <Link to="/profile"><label style={{fontSize:"14px"}}>Recruiter Profile</label></Link>
            <hr/>
            
      </div>
      </div>
      
    )
  }
}
export default JobRecruiter;