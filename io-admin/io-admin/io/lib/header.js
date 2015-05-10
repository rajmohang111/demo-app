exports.getAppLinks = function (parentApp, envPrefix) {
    var apps = [
            {url: 'http://forms.ge.com', icon: 'forms', text: 'Forms'},
            {url: 'http://io.ge.com', icon: 'io', text: 'I/O'},
            {url: 'http://mashups.ge.com', icon: 'mashups', text: 'Mashups'},
            //{url: 'http://surveys.ge.com', icon: 'surveys', text: 'Surveys'},
            {url: 'http://workflows.ge.com', icon: 'workflows', text: 'Workflows'}
        ],
        filterApps = [],
        c = 0;

    if (typeof envPrefix === 'string') {
        if (envPrefix.toLowerCase() !== 'production') {
            for (c; c < apps.length; c += 1) {
                apps[c].url = apps[c].url.split('//')[0] + '//' + envPrefix.toLowerCase() + '.' + apps[c].url.split('//')[1];
            }
            c = 0;
        }
    }
    if (typeof parentApp === 'string') {
        for (c; c < apps.length; c += 1) {
            if (apps[c].text.toLowerCase() !== parentApp.toLowerCase()) {
                filterApps.push(apps[c]);
            }
        }
    } else {
        filterApps = apps;
    }

    return filterApps;
};