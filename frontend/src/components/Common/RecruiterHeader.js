import React, { Component } from "react";
import { IMAGE_PATHS } from "../../constants/routes";
import { Link } from "react-router-dom";
import $ from "jquery";
import { connect } from "react-redux";
import HeaderImage from "../Files/Images/profile-placeholder.png";
import fetchProfile from "../../actions/profile";
import { withRouter } from "react-router";
import ReactAutocomplete from "react-autocomplete";
import Autocomplete from "react-autocomplete";
import { api, printError, printMessage } from "../../services";
import profileplaceholder from "../Files/Images/profile-placeholder.png";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      profileimage: HeaderImage,
      searchResults: [],
      value: "",
      refererobject: {}
    };
    console.log(HeaderImage);
    this.moveToProf = this.moveToProf.bind(this);
    this.valSelect = this.valSelect.bind(this);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.openPublicSearchProfile = this.openPublicSearchProfile.bind(this);

    console.log(this.props);
  }

  toggleMenu() {
    $(".user-account-settingss").toggleClass("active");
  }


  componentDidMount() {
    //this.props.dispatch(fetchProfile());
  }

  componentWillReceiveProps(nextProps) {
    try {
      let data = nextProps.user_profile.user_profile.user;
      console.log(data);
      if (data) {
        console.log(data.userimage);
        if (!data.profile_image) {
          data.profile_image = HeaderImage;
        }
        this.setState({
          username: data.name.first + " " + data.name.last,
          profileimage: data.profile_image
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  moveToProf() {
    console.log(this.props);
    this.props.history.push("/recruiterprofile");
  }

  onSearchFocus() {
    console.log("focus yes");
    $(".searchBtn-left")
      .addClass("rightfocus")
      .removeClass("leftfocus");
    //$(".searchBtn-right").removeClass("rightfocus");
  }

  onSearchBlur() {
    console.log("focus no");
    $(".searchBtn-left")
      .addClass("leftfocus")
      .removeClass("rightfocus");
    //$(".searchBtn-left").removeClass("leftfocus");
    //$(".searchBtn-right").addClass("rightfocus");
  }

  valSelect(e, id) {
    this.setState({
      value: e
    });
    this.onSearchBlur();
    $(".search-bar form div input").blur();
  }

  async onChangeSearch(e) {
    console.log("this chnge");
    this.setState({
      value: e.target.value
    });
    if (e.target.value.length >= 1) {
      let data = {
        name: e.target.value
      };
      try {
        let ret = await api("POST", "/search/users", data);
        console.log(ret);
        if (ret.status >= 200 && ret.status < 300) {
          let temparray = [];

          for (
            let k = 0;
            k <
            (ret["data"]["payLoad"].length > 5
              ? 5
              : ret["data"]["payLoad"].length);
            k++
          ) {
            let currentObj = ret["data"]["payLoad"][k];
            let temp = {
              userimage: "",
              label: "",
              membersince: "",
              userid: ""
            };

            let keys = Object.keys(currentObj);
            if (keys.indexOf("profile_image") != -1) {
              if (currentObj["profile_image"]) {
                temp.userimage = currentObj["profile_image"];
              } else {
                temp.userimage = profileplaceholder;
              }
            } else {
              temp.userimage = profileplaceholder;
            }
            temp.label =
              currentObj["name"]["first"] + " " + currentObj["name"]["last"];
            temp.lastname = "";
            temp.membersince = "";
            temp.userid = currentObj["id"];
            temparray.push(temp);
          }
          this.setState({
            searchResults: temparray
          });
          console.log(this.state);
        } else {
          throw "error";
        }
      } catch (error) {
        console.log(Object.keys(error), error.response);
        printError(error);
      }
    }
  }

  openPublicSearchProfile(e, f) {
    this.setState({
      value: f
    });
    let strx = "/public-profile/" + e;
    /* this.props.history.push({
			pathname: '/public-profile/'+e,
		}) */
    this.onSearchBlur();
    window.open(strx, "_blank");
  }


  async deleteProfile()
  {
		  let c = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");
		  if(c)
		  {
			try 
			{
				let userid = sessionStorage.getItem('user_id');
				let ret = await api('DELETE',('/users/'+userid));
				console.log(ret);
				if(ret.status>=200 && ret.status<300)
				{
					sessionStorage.clear();
					localStorage.clear();
					this.props.history.push("/");
				}
			}
			catch(e)
			{
				console.log(e);
			}
		  }
		
  }


  openPublicSearchProfile(e,f)
  {
		this.setState({
			'value': f
		});
		let strx = '/public-profile/'+e;
		/* this.props.history.push({
			pathname: '/public-profile/'+e,
		}) */
		this.onSearchBlur();
		window.open(strx,"_blank");
  }



  handlelogout()
  {
	  let c = window.confirm("Are you sure you want to logout?");
	  if(c)
	  {
		  sessionStorage.clear();
		  localStorage.clear();
      // this.props.history.push("/");
      window.location.href = "/"
	  }
  }



  render() {
    const commonProps = {
      onFocus: this.onSearchFocus,
      onBlur: this.onSearchBlur,
      id: "states-autocomplete"
    };
    return (
      <div>
        <header>
          <div className="container">
            <div className="header-data">
              <div className="logo">
                <a href="/" title="">
                  <img
                    className="header-logo"
                    src={require("../Files/Images/linkedinlogo.png")}
                    alt=""
                  />
                </a>
              </div>
              <div className="search-bar">
                <form>
                  {/*<!--<input type="text" name="search" placeholder="Search..." />-->*/}
                  <ReactAutocomplete
                    items={this.state.searchResults}
                    shouldItemRender={(item, value) =>
                      item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
                    }
                    getItemValue={item => item.label}
                    inputProps={commonProps}
                    wrapperStyle={{ position: "relative" }}
                    menuStyle={{ position: "absolute" }}
                    renderItem={(item, highlighted) => (
                      <div
                        key={item.userid}
                        data-uid={item.userid}
                        style={{
                          backgroundColor: highlighted ? "#FFF" : "#FFF",
                          padding: "10px",
                          cursor: "pointer"
                        }}
                      >
                        <span id={item.userid} className="user-image">
                          <img
                            src={item.userimage}
                            className="search-user-image"
                          />
                        </span>
                        <span className="search-firstname">{item.label}</span>
                        <span className="search-lastname">{item.lastname}</span>
                      </div>
                    )}
                    value={this.state.value}
                    onChange={e => this.onChangeSearch(e)}
                    onSelect={(value, item) => {
                      // set the menu to only the selected item
                      console.log(item);
                      console.log(item.userid);
                      this.openPublicSearchProfile(item.userid, value);
                    }}
                  />

                  <button type="button" className="searchBtn-left leftfocus">
                    <i className="fa fa-search" />
                  </button>
                  {/*<!--<button type="button" className="searchBtn-right afterfocusbutton"><i className="fa fa-search afterfocus"></i></button>-->*/}
                </form>
              </div>
              <nav>
                <ul>
                  <li>
                    <Link to="recruiterhome">
                      <div>
                        <i className="fa fa-home header-icons" />
                      </div>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/applicantconnection">
                      <div>
                        <i className="fa fa-user-friends header-icons" />
                      </div>
                      My Network
                    </Link>
                  </li>
                  <li>
                    <Link to="/postedjobs">
                      <div>
                        <i className="fa fa-briefcase header-icons" />
                      </div>
                      Post Jobs
                    </Link>
                  </li>
                  <li>
                    <a href="#" title="">
                      <div>
                        <i className="fa fa-bell header-icons" />
                      </div>
                      Notifications
                    </a>
                  </li>
                  <li>
                    <Link to="/message">
                      <div>
                        <i className="fa fa-comment-alt header-icons" />
                      </div>
                      Messaging
                    </Link>
                  </li>
                  {/* <!--<li>
								<a href="profiles.html" title="">
									<span><img src="images/icon4.png" alt=""></span>
									Profiles
								</a>
								<ul>
									<li><a href="user-profile.html" title="">User Profile</a></li>
									<li><a href="my-profile-feed.html" title="">my-profile-feed</a></li>
								</ul>
							</li>
							<li>
								<a href="jobs.html" title="">
									<span><img src="images/icon5.png" alt=""></span>
									Jobs
								</a>
							</li>
							<li>
								<a href="#" title="" className="not-box-open">
									<span><img src="images/icon6.png" alt=""></span>
									Messages
								</a>
								<div className="notification-box msg">
									<div className="nt-title">
										<h4>Setting</h4>
										<a href="#" title="">Clear all</a>
									</div>
									<div className="nott-list">
										<div className="notfication-details">
							  				<div className="noty-user-img">
							  					<img src="images/resources/ny-img1.png" alt="">
							  				</div>
							  				<div className="notification-info">
							  					<h3><a href="messages.html" title="">Jassica William</a> </h3>
							  					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do.</p>
							  					<span>2 min ago</span>
							  				</div> 
						  				</div>
						  				<div className="notfication-details">
							  				<div className="noty-user-img">
							  					<img src="images/resources/ny-img2.png" alt="">
							  				</div>
							  				<div className="notification-info">
							  					<h3><a href="messages.html" title="">Jassica William</a></h3>
							  					<p>Lorem ipsum dolor sit amet.</p>
							  					<span>2 min ago</span>
							  				</div> 
						  				</div>
						  				<div className="notfication-details">
							  				<div className="noty-user-img">
							  					<img src="images/resources/ny-img3.png" alt="">
							  				</div>
							  				<div className="notification-info">
							  					<h3><a href="messages.html" title="">Jassica William</a></h3>
							  					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempo incididunt ut labore et dolore magna aliqua.</p>
							  					<span>2 min ago</span>
							  				</div> 
						  				</div>
						  				<div className="view-all-nots">
						  					<a href="messages.html" title="">View All Messsages</a>
						  				</div>
									</div> 
								</div>
							</li>
							<li>
								<a href="#" title="" className="not-box-open">
									<span><img src="images/icon7.png" alt=""></span>
									Notification
								</a>
								<div className="notification-box">
									<div className="nt-title">
										<h4>Setting</h4>
										<a href="#" title="">Clear all</a>
									</div>
									<div className="nott-list">
										<div className="notfication-details">
							  				<div className="noty-user-img">
							  					<img src="images/resources/ny-img1.png" alt="">
							  				</div>
							  				<div className="notification-info">
							  					<h3><a href="#" title="">Jassica William</a> Comment on your project.</h3>
							  					<span>2 min ago</span>
							  				</div>
						  				</div>
						  				<div className="notfication-details">
							  				<div className="noty-user-img">
							  					<img src="images/resources/ny-img2.png" alt="">
							  				</div>
							  				<div className="notification-info">
							  					<h3><a href="#" title="">Jassica William</a> Comment on your project.</h3>
							  					<span>2 min ago</span>
							  				</div> 
						  				<div className="notfication-details">
							  				<div className="noty-user-img">
							  					<img src="images/resources/ny-img3.png" alt="">
							  				</div>
							  				<div className="notification-info">
							  					<h3><a href="#" title="">Jassica William</a> Comment on your project.</h3>
							  					<span>2 min ago</span>
							  				</div> 
						  				</div>
						  				<div className="notfication-details">
							  				<div className="noty-user-img">
							  					<img src="images/resources/ny-img2.png" alt="">
							  				</div>
							  				<div className="notification-info">
							  					<h3><a href="#" title="">Jassica William</a> Comment on your project.</h3>
							  					<span>2 min ago</span>
							  				</div> 
						  				</div>
						  				<div className="view-all-nots">
						  					<a href="#" title="">View All Notification</a>
						  				</div>
									</div> 
								</div> 
							</li>--> */}
                </ul>
              </nav>
              <div className="menu-btn">
                <a href="#" title="">
                  <i className="fa fa-bars" />
                </a>
              </div>
              <div className="user-account">
                <div className="user-info" onClick={this.toggleMenu}>
                  <img
                    src={this.state.profileimage}
                    className="header-image"
                    alt=""
                  />
                  <a href="javascript:void(0)">
                    Me<i className="toggler fas fa-chevron-down" />
                  </a>
                </div>
                <div className="user-account-settingss">
                  <ul className="us-links">
                    <li>
                      <a
                        href="javascript:void(0)"
                        title=""
                        className="lower-menu-text"
                        onClick={this.moveToProf}
                      >
                        <img
                          src={this.state.profileimage}
                          className="header-image lower-menu-image"
                          alt=""
                        />
                        {this.state.username}
                        <br />
                        <span className="menu-view-profile">View Profile</span>
                      </a>
                    </li>
                  </ul>
                  <h3>Free Upgrade to Premium</h3>
                  <h3>Setting</h3>
                  <ul className="us-links">
                    <li>
                      <a href="javascript:void(0)" title="">
                        Account Setting
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" title="">
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a href="javascript:void(0)" title="">
                        Faqs
                      </a>
                    </li>
                    <li><a href="javascript:void(0)" onClick={this.deleteProfile} >Delete Profile</a></li>
							</ul>
							<h3 className="tc"><a href="javascript:void(0)" onClick={this.handlelogout}>Logout</a></h3>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}
//export default Header;

function mapStateToProps(state) {
  console.log("in map state details profileVIEW", state);
  return state;
  //  return { property_detail: state.fetch_details_view.property_detail,
  //  };
}

export default withRouter(connect(mapStateToProps)(Header));
