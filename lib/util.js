function sprintf(f) {
    for( var i=1; i < arguments.length; i++ ) {
        f = f.replace(/%s/, arguments[i]);
    }
    return f;
}

function lz(t) {
    return (t < 10) ? '0' + t : '' + t;
}

function date2str(d) {
    var d = new Date(d);
    return lz(d.getHours()) + ':'
        + lz(d.getMinutes()) + ':'
        + lz(d.getSeconds());
}

function date2Str(d) {
    var d = new Date(d);
    return lz(d.getDate()) + '.'
        + lz(d.getMonth()+1) + ' '
        + lz(d.getHours()) + ':'
        + lz(d.getMinutes()) + ':'
        + lz(d.getSeconds());
}

function ms2str(ms) {
    if (!(typeof ms == 'number' && ms >= 0)) {
        return 'Error!';
    }
    var ss = Math.floor(ms / 1000);
    if (ss < 60) {
        return lz(ss) + ' sec';
    }
    var mm = Math.floor(ss / 60);
    ss = ss - (mm * 60);
    if (mm < 60) {
        return lz(mm) + ':' + lz(ss) + ' min';
    }
    var hh = Math.floor(mm / 60);
    mm = mm - (hh * 60);
    if (hh < 24) {
        return lz(hh) + ':' + lz(mm) + ':' + lz(ss);
    }
    return Math.floor(hh / 24) + ' day(s)';
}