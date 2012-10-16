$(function() {
    var Job = Backbone.Model.extend({
        idAttribute: 'name',
        initialize: function() {
            this.fetchBuildInformation();
            this.set('displayName', this.displayName());
            this.on('change:name', function() {
                this.set('displayName', this.displayName());
            }, this);
        },
        fetchBuildInformation: function() {
            $.ajax({
                url: this.get('url') + '/lastBuild/api/json',
                dataType: 'jsonp',
                jsonp: 'jsonp'
            }).always(_.bind(function() {
                this.set('informationFetched', true);
            }, this))
            .done(_.bind(function(response) {
                this.set({
                    status: response.result ? 'done' : 'inProgress',
                    progress: response.duration,
                    duration: response.estimatedDuration,
                    result: response.result,
                    failed: response.failed
                });
            }, this));
        },
        displayName: function() {
            return this.get('name').replace(/_/g, ' ');
        },
        isBuilding: function() {
            return this.get('progress') && !this.get('result');
        }
    });

    var JobsList = Backbone.Collection.extend({
        model: Job,
        url: window.jenky.conf.jenkins.url + '/api/json',
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

                    _.forEach(jobs, function(job) {
                        var existingJob = this.get(job.name);
                        if (existingJob) {
                            existingJob.set(job);
                        } else {
                            this.add(job);
                        }
                    }, this);
                }, this));
            }
        }
    });

    var Jobs = new JobsList();

    var JobView = Backbone.View.extend({
        tagName: "li",
        template: _.template($('#job-template').html()),
        initialize: function() {
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
            this.model.bind('informationFetched', function() {
            }, this);
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            if (this.model.get('informationFetched')) {
                console.log('informationFetched', this.model.get('name'));
                this.maybeShowProgress();
                this.$el.show();
            }
            return this;
        },
        maybeShowProgress: function() {
            var progress = this.$el.find('.progress');

            if (progress.length === 0)
                return;

            var main = progress.prev();

            progress.css({
                display: 'block',
                position: 'absolute',
                top: main.position().top + 'px',
                width: '20%'
            });
        }
    });

    var JenkyView = Backbone.View.extend({
        el: $('#jobs'),
        initialize: function() {
            Jobs.bind('add', this.addOne, this);
            Jobs.bind('reset', this.addAll, this);
            Jobs.bind('all', this.render, this);
            Jobs.fetch();
        },
        render: function() {
        },
        addOne: function(job) {
            var view = new JobView({model: job});
            $(view.render().el).appendTo(this.$el);
        },
        addAll: function() {
            this.$el.empty();
            Jobs.each(_.bind(this.addOne, this));
        },
        update: function() {
            Jobs.fetch();
        }
    });

    var app = window.jenky.app = new JenkyView();

    window.setInterval(function() {
        app.update();
    }, jenky.conf.jenkins.updateInterval);

    var lastModified = {};

    window.setInterval(function() {
        _.each(['index.html', 'css/main.css', 'js/main.js'], function(file) {
            $.get(file, function(data, status, jqXHR) {
                var modified = jqXHR.getResponseHeader('Last-Modified');

                var last = lastModified[file];

                if (!_.isUndefined(last) && modified !== last)
                    location.reload();

                lastModified[file] = modified;
            }, 'text');
        });
    }, jenky.conf.jenky.updateInterval);
});