$(window).load(function(){

var $startBtn = $('#startBtn');
var $stopBtn = $('#stopBtn');
var $resetBtn = $('#resetBtn');
var $totalCount = $('#totalCount');
var $count = $('#count');
var $startTime = $('#startTime');
var $timer = $('#timer');
var $savedTimes = $('#savedTimes');
var $savedPeriods = $('#savedPeriods');

var totalCount, stDate, savedTimes, savedPeriods, tickID;

savedTimes = JSON.parse(localStorage['savedTimes'] || '[]');

savedPeriods = JSON.parse(localStorage['savedPeriods'] || '[]');

stDate = JSON.parse(localStorage['stDate'] || 'false');

if (stDate) {
    $stopBtn.show();
    $startBtn.hide();
    $count.show();
    tickID = setInterval(tick, 100);
    $startTime.text(date2str(stDate));
} else {
    $stopBtn.hide();
    $startBtn.show();
    $count.hide();
};

displaySavedTimes();
displaySavedPeriods();

$(document).keyup(function(event){
    if (event.keyCode == 27 && stDate) {
        stopTimer();
    }

    if (event.keyCode == 13 && !stDate) {
        startTimer();
    }
 });

$startBtn.click(startTimer);

$stopBtn.click(stopTimer);

$resetBtn.click(function(){
    clearInterval(tickID);
    if (savedTimes.length > 0) {
        savedPeriods.unshift([totalCount, savedTimes[savedTimes.length - 1][0], savedTimes[0][1]]);
    };
    stDate = false;
    displaySavedPeriods();
    savedTimes = [];
    $stopBtn.hide();
    $startBtn.show();
    $count.hide();
    displaySavedTimes();
    localStorage['stDate'] = JSON.stringify(stDate);
    localStorage['savedTimes'] = JSON.stringify(savedTimes);
    localStorage['savedPeriods'] = JSON.stringify(savedPeriods);
    return false;
});

function tick(){
    var d = Date.now();
    $timer.text(date2str(d));
    $totalCount.text(ms2str(totalCount + (d - stDate)));
}

function startTimer() {
    stDate = Date.now();
    $startTime.text(date2str(stDate));
    tickID = setInterval(tick, 100);
    $count.show();
    $stopBtn.show();
    $startBtn.hide();
    localStorage['stDate'] = JSON.stringify(stDate);
    return false;
}

function stopTimer() {
    $count.hide();
    clearInterval(tickID);
    var d = Date.now();
    savedTimes.unshift([stDate, d]);
    localStorage['savedTimes'] = JSON.stringify(savedTimes);
    displaySavedTimes();
    $stopBtn.hide();
    $startBtn.show();
    stDate = false;
    localStorage['stDate'] = JSON.stringify(stDate);
    return false;
}

function displaySavedTimes() {
    var p = '';
    var s = $('#stLineTemplate').text();
    totalCount = 0;

    for(var i=0; i<savedTimes.length; i++) {
        p = p + sprintf(s, ms2str(savedTimes[i][1] - savedTimes[i][0]),
            date2str(savedTimes[i][0]), date2str(savedTimes[i][1]));
        totalCount += (savedTimes[i][1] - savedTimes[i][0]);
    }
    if (!stDate) {
        $totalCount.text(ms2str(totalCount));
    };
    $savedTimes.html(p);

    $('.e').click(function() {
        var $stLine = $(this).closest('.stLine');
        var n = $('.stLine').index($stLine);
        var stMin = (n < savedTimes.length - 1) ?
            savedTimes[n+1][1] :
            (savedTimes[n][0] - 3600000);
        var stMax = (n <= 0) ?
            (stDate || Date.now()) :
            savedTimes[n-1][0];
        var sliderMin = savedTimes[n][0];
        var sliderMax = savedTimes[n][1];
        var s = $('#sliderTemplate').text();

        $('.e, .x').hide();

        $stLine.replaceWith(s);

        $('#theSlider').slider({
            min: stMin,
            max: stMax,
            value: [savedTimes[n][0], savedTimes[n][1]],
            tooltip: 'always',
            ticks: [stMin, stMax],
            ticks_labels: [date2str(stMin), date2str(stMax)],
            formatter: function(value) {
                if (date2str(value[0]) == date2str(value[1])) {
                    return 'Delete';
                };
                return date2str(value[0]) + ' : ' + date2str(value[1]);
            }
        }).on('slide', function(slideEvt) {
            sliderMin = slideEvt.value[0];
            sliderMax = slideEvt.value[1];
        });

        $('#okBtn').click(function(){
            if (date2str(sliderMin) == date2str(sliderMax)) {
                savedTimes.splice(n,1);
            } else {
                savedTimes[n] = [sliderMin, sliderMax];
            };
            localStorage['savedTimes'] = JSON.stringify(savedTimes);
            displaySavedTimes();
            return false;
        });
        $('#cancelBtn').click(function(){
            displaySavedTimes();
            return false;
        });
        return false;
    });
    $('.x').click(function() {
        var n = $('.stLine').index($(this).closest('.stLine'));
        savedTimes.splice(n,1);
        localStorage['savedTimes'] = JSON.stringify(savedTimes);
        displaySavedTimes();
        return false;
    });
}

function displaySavedPeriods() {
    var p = '';
    var s = $('#periodTemplate').text();
    for(var i=0; i<savedPeriods.length; i++) {
        p = p + sprintf(s, ms2str(savedPeriods[i][0]),
            date2Str(savedPeriods[i][1]), date2Str(savedPeriods[i][2]));
    }
    $savedPeriods.html(p);
    
    $('.xx').click(function() {
        var n = $('.prdLine').index($(this).closest('.prdLine'));
        savedPeriods.splice(n,1);
        localStorage['savedPeriods'] = JSON.stringify(savedPeriods);
        displaySavedPeriods();
        return false;
    });
}

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

});