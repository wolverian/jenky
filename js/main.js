// TODO: update view elements in-place instead of removing and appending them again
// TODO: progress bar
// TODO: test count

function Jenkins(url) {
    this.base = url;
}

Jenkins.prototype.jobs = function() {
    return $.ajax({
        url: this.url(''),
        dataType: 'jsonp',
        jsonp: 'jsonp'
    });
};

Jenkins.prototype.url = function(path) {
    return this.base + path + '/api/json';
};

function View(list) {
    this.list = list;
    this.jobs = {};
}

View.prototype.add = function(job) {
    var key = this.key(job);
    var view = this.jobs[key];

    if (typeof view === "undefined")
        this.jobs[key] = new JobView(job);
    else
        view.update(job);
};

View.prototype.key = function(job) {
    return job.name;
};

View.prototype.addAll = function(jobs) {
    _.each(jobs, function(job, index) {
        this.add(job);
    }, this);
};

View.prototype.render = function() {
    var base = $(this.list);

    base.empty();

    _.each(this.jobs, function(job, key) {
        base.append(job.elem);
    }, this);
};

function JobView(job) {
    this.update(job);
}

JobView.prototype.update = function(job) {
    this.job = job;
    this.elem = this.render();
};

JobView.prototype.render = function() {
    var elem = $('<h2>', {
        text: this.job.name,
        'class': this.job.color
    });
    return $('<li>').append(elem);
};

function Controller(view, model) {
    this.view = view;
    this.model = model;

    var update = _.bind(function() {
        this.update();
    }, this);

    var delayed = function() {
        update();
        _.delay(delayed, 10000);
    };

    delayed();
}

Controller.prototype.update = function() {
    this.model.jobs().then(_.bind(function(jobs) {
        this.view.addAll(jobs.jobs);
        this.view.render();
    }, this));
};

var jenkins = new Jenkins('http://deveo.office.eficode.fi:8080');
var view = new View('#jobs');
var controller = new Controller(view, jenkins);