$(function() {
// TODO: update view elements in-place instead of removing and appending them again
// TODO: progress bar
// TODO: test count

    function Jenkins(url) {
        this.base = url;
    }

    Jenkins.prototype.jobs = function() {
        var deferred = $.Deferred();

        $.ajax({
            url:      this.url(''),
            dataType: 'jsonp',
            jsonp:    'jsonp'
        }).then(function(data) {
                deferred.resolve(data.jobs);
            }, this);

        return deferred.promise();
    };

    Jenkins.prototype.duration = function(name) {
        var deferred = $.Deferred();

        $.ajax({
            url:      this.url('job/' + name),
            dataType: 'jsonp',
            jsonp:    'jsonp'
        }).then(_.bind(function(job) {
            $.ajax({
                url:      job.lastBuild.url + '/api/json',
                dataType: 'jsonp',
                jsonp:    'jsonp'
            }).then(_.bind(function(build) {
                var progress = build.duration;
                var estimate = build.estimatedDuration;

                deferred.resolve({
                    progress: progress,
                    estimate: estimate
                });
            }, this));
        }, this));

        return deferred.promise();
    };

    Jenkins.prototype.url = function(path) {
        return this.base + '/' + path + '/api/json';
    };

    var Job = Backbone.Model.extend({
        idAttribute: 'name',
        initialize: function() {
            if (this.get('color') === "blue_anime")
                this.fetchProgress();
        },
        fetchProgress: function() {
            $.ajax({
                url: this.get('url') + '/lastBuild/api/json',
                dataType: 'jsonp',
                jsonp: 'jsonp'
            }).then(_.bind(function(response) {
                console.log('updating myself', response);

                this.set({
                    progress: response.duration,
                    duration: response.estimatedDuration
                });
            }, this));
        }
    });

    var JobsList = Backbone.Collection.extend({
        model: Job,
        url: 'http://deveo.office.eficode.fi:8080/api/json',
        parse: function(response) {
            return _.map(response.jobs, function(job) {
                return {
                    name: job.name,
                    color: job.color,
                    duration: job.duration,
                    url: job.url
                };
            }, this);
        },
        sync: function(method, model, options) {
            if (method === "read") {
                $.ajax({
                    url: this.url,
                    dataType: 'jsonp',
                    jsonp: 'jsonp'
                }).then(_.bind(function(data) {
                    var jobs = this.parse(data);

                    _.each(jobs, function(job) {
                        model.add(job);
                    }, this);
                }, this));
            }
        }
    });

    var Jobs = new JobsList();

    var JobView = Backbone.View.extend({
        tagName:    "li",
        template:   _.template($('#job-template').html()),
        initialize: function() {
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
        },
        render:     function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var AppView = Backbone.View.extend({
        el:         $('#jobs'),
        initialize: function() {
            Jobs.bind('add', this.addOne, this);
            Jobs.bind('reset', this.addAll, this);
            Jobs.bind('all', this.render, this);
            Jobs.fetch();
        },
        render:     function() {
        },
        addOne:     function(job) {
            console.log('view.addOne');
            var view = new JobView({model: job});
            this.$el.append(view.render().el);
        },
        addAll:     function() {
            Todos.each(this.addOne);
        }
    });

    var jenkins = new Jenkins('http://deveo.office.eficode.fi:8080');

    var App = window.App = new AppView();
});