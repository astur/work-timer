function userAppSPALogin(_appId, lsName, app, defs) {

    UserApp.initialize({ appId: _appId });
    init(session());

    function session(data){
        if (data === undefined) {
            return localStorage[lsName];
        };
        if (data === null) {
            localStorage.removeItem(lsName);
            return;
        };
        localStorage[lsName] = data;
    }

    function init(token) {
        if (!token) {
            showAuthPage();
        } else {
            UserApp.setToken(token);
            UserApp.User.get({ user_id: 'self' }, function(error, user) {
                if (error) {
                    showAuthPage();
                } else {
                    showMainPage(user[0]);
                }
            });
        }
    }

    function showAuthPage(message) {
        if (message) alert(message);
        $('body').html($('#authTemplate').text());
        $('#authForm').submit(function(){
            if ($('#newuser').prop("checked")) {
                signup();
            } else {
                login();
            };
            return false;
        });

        function login() {
            UserApp.User.login({
                login: $('#username').val(),
                password: $('#password').val()
            }, function(error, result) {
                if (error) {
                    showAuthPage('Error: ' + error.message);
                } else {
                    session(result.token);
                    init(result.token);
                }
            });
            return false;
        }

        function signup() {
            UserApp.User.save({
                login: $('#username').val(),
                password: $('#password').val()
            }, function(error, user) {
                if (error) {
                    showAuthPage('Error: ' + error.message);
                } else {
                    login();
                }
            });
            return false;
        }
    }

    function showMainPage(user) {
        var _so = {};
        var inStr = user.properties.test_prop.value;
        try {
            var inObj = JSON.parse(inStr);
            for(var key in inObj){
                _so[key] = inObj[key];
            }
        } catch (e) {
            console.log(e.message);
            console.log(inStr);
        }

        _so.save = function () {
            UserApp.User.save({
                user_id: "self",
                properties: {
                    test_prop: {
                        value: JSON.stringify(this),
                        override: true
                    }
                }
            }, function(error, result){
                if (error) console.log('Error: ' + error.message);
            });
        }

        if (typeof defs === 'object') {
            for(var key in defs){
                _so[key] = _so[key] === undefined ?
                    defs[key] :
                    _so[key];
            }
            _so.save();
        };

        app(user.login, function(){
            session(null);
            showAuthPage();
            return false;
        }, _so);
    }
}