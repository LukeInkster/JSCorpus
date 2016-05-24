var auth = require('../src/Auth');
var Config = require('../src/Config');
var rest = require('../src/rest');
var InstallationsRouter = require('../src/Routers/InstallationsRouter').InstallationsRouter;

var config = new Config('test');

describe('InstallationsRouter', () => {
  it('uses find condition from request.body', (done) => {
    var androidDeviceRequest = {
      'installationId': '12345678-abcd-abcd-abcd-123456789abc',
      'deviceType': 'android'
    };
    var iosDeviceRequest = {
      'installationId': '12345678-abcd-abcd-abcd-123456789abd',
      'deviceType': 'ios'
    };
    var request = {
      config: config,
      auth: auth.master(config),
      body: {
        where: {
          deviceType: 'android'
        }
      },
      query: {}
    };

    var router = new InstallationsRouter();
    rest.create(config, auth.nobody(config), '_Installation', androidDeviceRequest)
    .then(() => {
      return rest.create(config, auth.nobody(config), '_Installation', iosDeviceRequest);
    }).then(() => {
      return router.handleFind(request);
    }).then((res) => {
      var results = res.response.results;
      expect(results.length).toEqual(1);
      done();
    });
  });

  it('uses find condition from request.query', (done) => {
    var androidDeviceRequest = {
      'installationId': '12345678-abcd-abcd-abcd-123456789abc',
      'deviceType': 'android'
    };
    var iosDeviceRequest = {
      'installationId': '12345678-abcd-abcd-abcd-123456789abd',
      'deviceType': 'ios'
    };
    var request = {
      config: config,
      auth: auth.master(config),
      body: {},
      query: {
        where: {
          deviceType: 'android'
        }
      }
    };

    var router = new InstallationsRouter();
    rest.create(config, auth.nobody(config), '_Installation', androidDeviceRequest)
        .then(() => {
          return rest.create(config, auth.nobody(config), '_Installation', iosDeviceRequest);
        }).then(() => {
      return router.handleFind(request);
    }).then((res) => {
      var results = res.response.results;
      expect(results.length).toEqual(1);
      done();
    });
  });

  it('query installations with limit = 0', (done) => {
    var androidDeviceRequest = {
      'installationId': '12345678-abcd-abcd-abcd-123456789abc',
      'deviceType': 'android'
    };
    var iosDeviceRequest = {
      'installationId': '12345678-abcd-abcd-abcd-123456789abd',
      'deviceType': 'ios'
    };
    var request = {
      config: config,
      auth: auth.master(config),
      body: {},
      query: {
        limit: 0
      }
    };

    var router = new InstallationsRouter();
    rest.create(config, auth.nobody(config), '_Installation', androidDeviceRequest)
        .then(() => {
          return rest.create(config, auth.nobody(config), '_Installation', iosDeviceRequest);
        }).then(() => {
      return router.handleFind(request);
    }).then((res) => {
      var response = res.response;
      expect(response.results.length).toEqual(0);
      done();
    });
  });

  it('query installations with count = 1', (done) => {
    var androidDeviceRequest = {
      'installationId': '12345678-abcd-abcd-abcd-123456789abc',
      'deviceType': 'android'
    };
    var iosDeviceRequest = {
      'installationId': '12345678-abcd-abcd-abcd-123456789abd',
      'deviceType': 'ios'
    };
    var request = {
      config: config,
      auth: auth.master(config),
      body: {},
      query: {
        count: 1
      }
    };

    var router = new InstallationsRouter();
    rest.create(config, auth.nobody(config), '_Installation', androidDeviceRequest)
        .then(() => {
          return rest.create(config, auth.nobody(config), '_Installation', iosDeviceRequest);
        }).then(() => {
      return router.handleFind(request);
    }).then((res) => {
      var response = res.response;
      expect(response.results.length).toEqual(2);
      expect(response.count).toEqual(2);
      done();
    });
  });

  it('query installations with limit = 0 and count = 1', (done) => {
    var androidDeviceRequest = {
      'installationId': '12345678-abcd-abcd-abcd-123456789abc',
      'deviceType': 'android'
    };
    var iosDeviceRequest = {
      'installationId': '12345678-abcd-abcd-abcd-123456789abd',
      'deviceType': 'ios'
    };
    var request = {
      config: config,
      auth: auth.master(config),
      body: {},
      query: {
        limit: 0,
        count: 1
      }
    };

    var router = new InstallationsRouter();
    rest.create(config, auth.nobody(config), '_Installation', androidDeviceRequest)
        .then(() => {
          return rest.create(config, auth.nobody(config), '_Installation', iosDeviceRequest);
        }).then(() => {
      return router.handleFind(request);
    }).then((res) => {
      var response = res.response;
      expect(response.results.length).toEqual(0);
      expect(response.count).toEqual(2);
      done();
    });
  });
});
