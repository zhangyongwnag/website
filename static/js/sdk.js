(function (window) {
  'use strict'
  let _events = [
    'onchildframemessage'
    , 'onupdaterecents'
    , 'onupdaterecovers'
    , 'on_native_message'
    , 'on_check_auth'
    , 'onChangeCryptoMode'
    , 'onfeaturesavailable'
  ];

  let subscribers = {
    any: [] // event type: subscribers
  };

  var sdk = window.AscDesktopEditor;

  if (!sdk) return

  sdk.on = function (type, fn, context) {
    type = type || 'any';
    fn = typeof fn === 'function' ? fn : context[fn];
    if (typeof subscribers[type] === "undefined") {
      subscribers[type] = [];
    }

    subscribers[type].push({fn: fn, context: context || this});
  };

  sdk.remove = function (type, fn, context) {
    notifySubscribers('unsubscribe', type, fn, context);
  };

  sdk.fire = function (type, publication) {
    notifySubscribers('publish', type, publication);
  };

  sdk.command = function () {
    window.AscDesktopEditor.execCommand.apply(this, arguments);
  };

  sdk.externalClouds = function () {
    let _clouds = sdk.GetExternalClouds();
    if (_clouds) {
      for (let c of _clouds) {
        (!c.check || !c.check.url) && (c.check = {url: ''});
        if (!c.check.url.startsWith('/'))
          c.check.url = '/'.concat(c.check.url);
        if (!c.provider && !!c.id)
          c.provider = c.id;
        if (!c.startPage)
          c.startPage = '/';
      }
    } else {
      _clouds = [{
        provider: "asc",
        name: "ONLYOFFICE",
        check: {url: "/api/2.0/capabilities.json"}
      }];
    }

    return _clouds;
  };

  sdk.encrypt = {
    ENCRYPT_MODE_NONE: 0,
    ENCRYPT_MODE_SIMPLE: 1,
    ENCRYPT_MODE_STANDARD: 2,
    ENCRYPT_MODE_ADVANCED: 3
  };

  sdk.CryptoMode = sdk.GetCryptoMode();
  sdk.encrypt.mode = function (mode, pass) {
    if (!!mode) sdk.SetCryptoMode(pass, mode);
    else return sdk.CryptoMode;
  };

  sdk.encrypt.available = function () {
    return sdk.GetSupportCryptoModes();
  };

  window.onChangeCryptoMode = e => {
    sdk.CryptoMode = e;
  };

  var notifySubscribers = function (action, type, arg, context) {
    var pubtype = type || 'any',
      pubsubscribers = subscribers[pubtype],
      max = pubsubscribers ? pubsubscribers.length : 0;

    for (let i = 0; i < max; i += 1) {
      if (action === 'publish') {
        // Call our observers, passing along arguments
        pubsubscribers[i].fn.apply(pubsubscribers[i].context, arg);
      } else {
        if (pubsubscribers[i].fn === arg && pubsubscribers[i].context === context) {
          pubsubscribers.splice(i, 1);
        }
      }
    }
  };

  for (let e of _events) {
    window[e] = function () {
      notifySubscribers('publish', e, arguments)
    };
  }
  ;

  window.sdk = sdk;
}(window))
