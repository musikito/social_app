import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Alert = ({ alerts }) => {
  return <div />;
};

Alert.propTypes = {
    alerts: PropTypes.array.isRequired
};


//get the arrays of alerts
const mapStateToProps = state =>({
    //get the alert from the reducer
    //props.alert will be available
 alerts:state.alert
})

export default connect()(Alert);
