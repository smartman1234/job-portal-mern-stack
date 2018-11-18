import React, { Component } from 'react'
import "./jobs.css";

class JobSaved extends Component {
  render() {
    return (
      <div className="row left-job-detail" >
           
              <div className="col-md-2 left-job-detail-image">
                  <img src="" class="img-fluid job-card-image" alt="LinkedIn" />
              </div>
              <div className="col-md-10 left-job-detail-desc">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              </div>
              <div className="job-save-card">
                        <div class='child inline-block-child' style={{paddingRight:"20px"}}><button type="button" class="btn btn-outline-primary btn-save" style={{fontWeight:"bold"}}>Save</button></div>
                        <div class='child inline-block-child'><button type="button" className="btn easy-apply">Easy Apply</button></div>
              </div> 
      </div>
    )
  }
}
export default JobSaved;