var noble = require('noble');

var mac = process.argv[2].toLowerCase();

noble.on('discover', function(device) {
    console.error("Found device " + device.address); 
    if (device.address != mac)
        return;

    console.error("Connecting " + device.address);

    //noble.on('scanStop', function() {
    setTimeout(function() {
        if (device.state == 'connected')
            onconnect(device);
        else 
            device.connect(function(error) {
                if (error != null)
                    console.error(error);
                else
                    onconnect(device);
            });
    }, 200);
    //});

    noble.stopScanning();
});

var onconnect = function(device) {
    console.error("Connected to " + device.advertisement.localName);
    device.once('disconnect', ondisconnect);
    device.discoverServices(["03b80e5aede84b33a7516ce34ec4c700"], function(error, services) {
        if (error != null)
            console.error(error);
        else {
            console.error("Got midi service on " + device.advertisement.localName);
            services[0].discoverCharacteristics([], function(error, chars) {
                if (error != null)
                    console.error(error);
                else {
                    console.error("Got midi characteristic on " + device.advertisement.localName);
                    work(device, chars[0]);
                }
            });
        }
    });
}

var work = function (device, char) {
    char.on('read', onread);

    char.subscribe(function (error) {
        if (error != null)
            console.error(error);
        else
            console.error('Passing data...');
    });

    // initial read should return empty response
    char.read(function(error, data) {
        if (error != null)
            console.error(error);
    });
}

var onread = function (data, isnotify) {
    //console.error(data);
    process.stdout.write(data);
}

var ondisconnect = function () {
    noble.startScanning();
}

noble.on('stateChange', function(state) {
    console.error('Entering ' + state + ' state');
    if (state == 'poweredOn') {
        console.error('Starting scan...');
        noble.startScanning();
    }
    else
        noble.stopScanning();
});

