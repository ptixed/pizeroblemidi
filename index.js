var noble = require('noble');

var mac = process.argv[2].toLowerCase();

noble.on('discover', function(device) {
    console.log("Found device " + device.address); 
    if (device.address != mac)
        return;

    console.log("Connecting " + device.address);

    //noble.on('scanStop', function() {
    setTimeout(function() {
        if (device.state == 'connected')
            onconnect(device);
        else 
            device.connect(function(error) {
                if (error != null)
                    console.log(error);
                else
                    onconnect(device);
            });
    }, 200);
    //});

    noble.stopScanning();
});

var onconnect = function(device) {
    console.log("Connected to " + device.advertisement.localName);
    device.discoverServices(["03b80e5aede84b33a7516ce34ec4c700"], function(error, services) {
        if (error != null)
            console.log(error);
        else {
            console.log("Got midi service on " + device.advertisement.localName);
            services[0].discoverCharacteristics([], function(error, chars) {
                if (error != null)
                    console.log(error);
                else {
                    console.log("Got midi characteristic on " + device.advertisement.localName);
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
            console.log(error);
    });

    // initial read should return empty response
    char.read(function(error, data) {
        if (error != null)
            console.log(error);
    });

    /*
    char.discoverDescriptors(function (error, descs) {
        if (error != null)
            console.log(error);
        else {
           for (var i = 0; i < descs.length; ++i)
               descs[i].readValue(function (error, data) {
                   if (error != null)
                       console.log(error);
                   else
                       console.log(data);
               });
        }
    });
     */
}

var onread = function (data, isnotify) {
    console.log(data);
}

noble.on('stateChange', function(state) {
    console.log('Entering ' + state + ' state');
    if (state == 'poweredOn') {
        console.log('Starting scan...');
        noble.startScanning();
    }
    else
        noble.stopScanning();
});

