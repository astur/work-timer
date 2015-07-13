function StoredObj(sn, defs){
    var storageName = sn === undefined ? 'myStorage' : sn;
    this.save = function(){
        localStorage[storageName] = JSON.stringify(this);
    }
    if (localStorage.getItem(storageName) !== null) {
        var inObj = JSON.parse(localStorage[storageName]);
        for(var key in inObj){
            this[key] = inObj[key];
        }
    }
    if (typeof defs === 'object') {
        for(var key in defs){
            this[key] = this[key] === undefined ? defs[key] : this[key];
        }
        this.save();
    };
}