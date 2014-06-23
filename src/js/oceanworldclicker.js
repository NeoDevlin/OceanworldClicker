
function setInnerHTML(id,html) {
    document.getElementById(id).innerHTML = html;
}
function setFloat(id,value) {
    setInnerHTML(id,sprintf("%.2f",value));
}
function setInt(id,value) {
    setInnerHTML(id,sprintf("%d",value));
}

state = {};
state.plastic = {};
state.plastic.name = "plastic";
state.plastic.current = 0;
state.plastic.nearby = 10;
state.water = {};
state.water.current = 1;
state.water.max = {};
state.water.max.current = 10;
state.water.max.build = [{'variable':state.water.max,'amount':10},{'variable':state.plastic,'amount':-10}];
state.water.supplies = {};
state.water.supplies.current = 1;
state.water.supplies.name = "supplies";
state.water.supplies.effect = 1;
state.water.supplies.build = [{'variable':state.water.supplies,'amount':1},{'variable':state.plastic,'amount':-10}];
state.water.rate = 0;

state.log = []
// For the time now
// http://stackoverflow.com/a/10211214/798588
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
}

function log(msg) {
    state.log.push(msg);
    console.log(msg);
    date = new Date().timeNow()
    document.getElementById("log").innerHTML = "<div>" + date + " " + msg + "</div>" + document.getElementById("log").innerHTML;
}

function updateWater() {
    setFloat("water",state.water.current);
    setFloat("waterMax",state.water.max.current);
    setInt("waterSupplies",state.water.supplies.current);
    setFloat("waterRate",state.water.rate);
}
function updatePlastic() {
    setInt("plastic",state.plastic.current);
    setInt("plasticNearby",state.plastic.nearby);
}
function updateResources() {
    updatePlastic();
}

function updateAll() {
    updateWater();
    updatePlastic();
    // updateLog();
}

function increment(variable, incr) {
    if(!isNaN(incr)){
        if(variable.hasOwnProperty("nearby")) {
            incr = Math.min(incr,variable.nearby);
            variable.nearby -= incr;
        }

        variable.current += incr;
        if(variable.hasOwnProperty("max")) {
            variable.current = Math.min(variable.current, variable.max.current);
        }
    }
}
function decrement(variable, decr) {
    increment(variable, -decr);
}
function build(recipe, n) {
    var applicable = true;
    for (var i = recipe.length - 1; i >= 0; i--) {
        console.log(recipe[i]);
        if (recipe[i].variable.current+recipe[i].amount<0){
            applicable = false;
            break;
        }
    }
    if(applicable) {
        for (var i = recipe.length - 1; i >= 0; i--) {
            increment(recipe[i].variable,recipe[i].amount);
        }
    }
}
function random(min,max) {
    return Math.random() * (max-min) + min;
}
function swim() {
    log("Found new resources");
    state.plastic.nearby = random(10-5,10+5);
}

function loop() {
    // calculate water rate
    state.water.rate = 0;
    state.water.rate -= 0.1;
    state.water.rate += 1 * state.water.supplies.effect * state.water.supplies.current;
    // apply water rate
    increment(state.water, state.water.rate)
    updateAll();
}

updateAll();
loop_interval = window.setInterval(loop, 1000);