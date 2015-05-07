#work-timer

Web-timer counting how much you work (or doing something else). Like sport timer for work.

Click "Start" when you begin to work and click "Stop" when you take break. You may also click "Reset" if you want. Perfectionists may edit or delete wrong intervals.

Web-timer is localStorage based, so no any server-side sync is there. And no complicated statistics, no history, no archive, no social functionality and no evil boss watching you. It's really easy thing, no rocket science.

###Version history:

* __v0.1.0__ "Just works".
* __v0.1.1__ Bootstrap style.

###TODO:

* Add history of work days (save on reset)
* Move html strings out of js
* Make storage sync with server side
* Refactoring (don't store `totalCount`, `$.closest` instead `$.parent`, one button for _Start/Stop_, table layout for `savedTimes`, standard quotes, etc.)

