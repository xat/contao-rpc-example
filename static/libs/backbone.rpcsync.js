(function (Backbone, _) {

  Backbone.sync = function (method, model, options) {
    // Default JSON-request options.
    var params = {type:'POST', dataType:'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    params.data = {
      'rpc':JSON.stringify({
        jsonrpc:'2.0',
        method:model.methods[method],
        id:_.uniqueId(),
        params:model.toJSON(options)
      }),
      'provider':'json'
    };

    _.defaults(params.data, model.postParams);

    var success = options.success;
    var error = options.error;
    options.success = function (resp, status, xhr) {
      if (resp.result) {
        if (success) {
          success(resp.result, status, xhr);
        }
        model.trigger('sync', model, resp.result, options);
        return;
      }

      if (error) {
        error(model, resp.error, options);
      }
      model.trigger('error', model, resp.error, options);
    };

    options.error = function (xhr, status, thrown) {
      if (error) {
        error(model, xhr, options);
      }
      model.trigger('error', model, xhr, options);
    };

    // Make the request, allowing the user to override any Ajax options.
    var xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

})(Backbone, _);