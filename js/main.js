$(function() {
    var App = window.App = Em.Application.create();

    var Job = App.Job = DS.Model.extend({
        name: DS.attr('string'),
        color: DS.attr('string'),
        building: DS.attr('boolean'),
        timestamp: DS.attr('number'),
        estimatedDuration: DS.attr('number'),
        duration: function() {
            return Date.now() - this.get('timestamp');
        }.property('timestamp'),
        displayName: function() {
            return this.get('name').replace(/_/g, ' ');
        }.property('name'),
        primaryKey: 'name',
        _previousColor: DS.attr('string'),
        previousColor: function() {
            if (!this.get('_previousColor'))
                this.set('_previousColor', this.get('color'));

            return this.get('_previousColor');
        }.property('color')
    });

    Job.reopenClass({
        collectionUrl: '/'
    });

    var adapter = App.adapter = DS.Adapter.create({
        baseUrl: window.jenky.conf.jenkins.url,
        findAll: function(store, type, since) {
            jQuery.ajax(this.get('baseUrl') + type.collectionUrl + '/api/json?tree=jobs[name,color,lastBuild[id,building,timestamp,estimatedDuration]]', {
                dataType: 'jsonp',
                jsonp: 'jsonp',
                success: _.bind(function(data) {
                    var jobs = data.jobs;
                    var parsed = _.map(jobs, this.parse, this);
                    var ids = _.map(jobs, function(job) { return job.name; });
                    store.loadMany(type, ids, parsed);
                }, this)
            });
        },
        parse: function(obj) {
            return {
                name: obj.name,
                color: obj.color,
                id: obj.lastBuild.id,
                timestamp: obj.lastBuild.timestamp,
                estimatedDuration: obj.lastBuild.estimatedDuration,
                building: obj.lastBuild.building
            };
        }
    });

    var store = App.store = DS.Store.create({
        revision: 6,
        adapter: adapter
    });

    var jobsController = App.jobsController = Ember.ArrayController.create();

    $('body').css({
        'font-family': window.jenky.conf.jenky.font
    });

    jobsController.set('content', store.findAll(Job));

    function resize() {
        var jobs = $('ul');

        var windowHeight = $(window).height();

        var topMargin = 50;
        var leftMargin = 40;

        var containerHeight = windowHeight - topMargin;

        jobs.css({
            height: containerHeight + 'px',
            top: topMargin + 'px',
            left: leftMargin + 'px'
        });

        var items = jobs.find('li');
        var height = Math.floor(containerHeight / Math.ceil(items.length / 2));

        items.css({
            height: height
        });
    }

    App.JobsView = Ember.CollectionView.extend({
        tagName: 'ul',
        itemViewClass: Ember.View.extend({
            templateName: 'job',
            didInsertElement: function() {
                resize();
                this.displayProgress();
            },
            displayProgress: function() {
                var progressElement = this.$('.progress');

                if (progressElement.length == 0)
                    return;

                var main = progressElement.prev();

                var duration = this.content.get('duration');
                var total = this.content.get('estimatedDuration');
                var done = duration / total;

                var width = Math.round(done * main.width());

                progressElement.css({
                    width: width
                });
            }
        })
    });

    $(window).resize(_.throttle(resize, 200));

//    App.update(_.debounce(_.bind(App.update, App), window.jenky.conf.jenkins.updateInterval));
});