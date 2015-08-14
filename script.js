$(window).load(function(){
    userAppSPALogin(
        'Your_UserApp_appId', //Write here your UserApp appId!!!
        'ua_session_token',
        workTimer,
        {savedTimes: [], savedPeriods: [], stDate: false});
});