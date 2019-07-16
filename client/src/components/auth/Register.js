import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
//import axios
//import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  //destruct the whole form
  const { name, email, password, password2 } = formData;
  //onChange to set the data from the form
  //copy the data using spread operator
  //targeting the value of e
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //@onSubimt to submit the form
  const onSubmit = async e => {
    e.preventDefault();
    //make sure pass match
    if (password !== password2) {
      //@todo add an alert, use console log for now
      console.log("passwords do not match");
    } else {
      // const newUser = {
      //name,
      //email,
      //password
      //};
      //try {
      //create the headers
      // const config = {
      // headers: {
      // "Content-Type": "application/json"
      //  }
      // };
      //create the body to be send to the backend
      //const body = JSON.stringify(newUser);
      //create a res to send the data
      //see api/users
      /**
       * 1st param is the api end
       * 2nd param is the body
       * 3rd param is the config headers
       */
      // const res = await axios.post("/api/users", body, config);

      console.log("SUCCESS");
      // } catch (err) {
      //  console.error(err.response.data);
      // } //end trycatch
    } //end if else
  };

  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Create Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onChange(e)}
            required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onChange(e)}
            required
            minLength='6'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={e => onChange(e)}
            required
            minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

export default Register;
