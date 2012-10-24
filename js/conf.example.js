(function() {
    var seconds = 1000;
    window.jenky = {};
    window.jenky.conf = {
        jenkins: {
            url: 'change me',
            updateInterval: 5 * seconds
        },
        jenky: {
            updateInterval: 10 * seconds,
            font: 'freight-sans-pro',
            typekitKitId: "your typekit kit ID"
        }
    };
}(window));