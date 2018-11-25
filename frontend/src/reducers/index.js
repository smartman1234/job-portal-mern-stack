import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import GetJobSingle from "./jobsingle.js";
import GetJobs from "./jobs.js";
import LoginReducer from "./login";
import user_profile  from "./profile";
import SearchedJobs from "./SearchedJobs.js";
import SetActiveID from "./jobCardActiveId"

const rootReducer = combineReducers({
  //reducer: mainreducer,
  form: formReducer,
  job_detail:GetJobSingle,
  jobs_all:GetJobs,
  LoginReducer,
  user_profile,
  searched_jobs:SearchedJobs,
  active_id:SetActiveID
});

export default rootReducer;
