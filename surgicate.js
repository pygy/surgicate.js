var fs = require("fs")

module.exports = function surgicate(options) {
    return new Surgicate(options);
}

function Surgicate(options) {
    this.source = options.source;
    if (options.path) {
        this.source = fs.readFileSync(options.path).toString();
        this.path = options.path;
    } else {
        this.path = this.source.slice(0, 20) +"...";
    }
    this.hashes = options.hashes ? setify(options.hashes) : {};
}

var sp = Surgicate.prototype

sp.graft = function(label, content) {
    var graftpoint = "/***///+"+label;
    parts = this.split(graftpoint);
    if (parts.length > 2) {
        throw "multple graftpoints named '"+label+"' in "+this.path;
    }
    parts[1] = content + graftpoint + parts[1];
    this.source = parts.join("");
    return this;
};

sp.excise = function(label) {
    var parts = this.source.split("/*/-"+label+"-/*/");
    if (parts.length % 2 != 1) {
        throw  "odd number of excision points in " + this.path;
    }
    var scar = "/*/+" + label + "+/*/"
    for (var i = 1; i < parts.length; i+=2) parts[i] = scar;
    this.source = parts.join("");
    return this;
};
sp.shove = function(target, content, i) {
    //surgicate("foobar").shove("foo#bar", "qux").toString --> "fooquxbar"
    return this;
};
sp.butcher = function(start, end, i, j) {
    //surgicate("zabcz").butcher("a", "c").toString --> "zcz"
    return this;
};

sp.valueOf = sp.toString = function () {
    return this.source
};


function setify(ary) {
    var set = {};
    ary.forEach(function(e){set[e]=true;});
    return set;
}
/*/-o-/*/
//FOOO
/*/-o-/*/