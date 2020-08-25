angular.module('umbraco.services').factory('simpleElementServices', function ($q, contentResource) {
    var notSupported = [
        "Umbraco.Tags",
        "Umbraco.UploadField",
        "Umbraco.ImageCropper"
    ];

    var services = {
        scaffold: function (alias, data) {
            var defer = $q.defer();

            contentResource.getScaffold(-20, alias).then(function (scaffold) {

                if (!scaffold.isElement) {
                    defer.reject(alias + " is not element type");
                    return;
                }


                services.cleanScaffold(scaffold);

                if (data) {
                    services.populate(scaffold, data);
                }

                defer.resolve({ scaffold, data });

            }, function (error) {
                defer.reject(error);
            });

            return defer.promise;
        },

        cleanScaffold: function (scaffold) {
            for (var t = 0; t < scaffold.variants[0].tabs.length; t++) {
                var tab = scaffold.variants[0].tabs[t];
                for (var p = tab.properties.length - 1; p >= 0; p--) {
                    var prop = tab.properties[p]
                    if (notSupported.indexOf(prop.editor) > -1) {
                        tab.properties.splice(p, 1);
                    }
                }
            }

            return scaffold;
        },

        populate: function (scaffold, node) {
            for (var t = 0; t < scaffold.variants[0].tabs.length; t++) {
                var tab = scaffold.variants[0].tabs[t];
                for (var p = 0; p < tab.properties.length; p++) {
                    var prop = tab.properties[p];

                    if (node[prop.alias]) {
                        prop.value = node[prop.alias];
                    } else {
                        node[prop.alias] = prop.value;
                    }
                }
            }
        },

        flatten: function (editorNode) {
            var value = {};

            for (var t = 0; t < editorNode.variants[0].tabs.length; t++) {

                var tab = editorNode.variants[0].tabs[t];

                for (var p = 0; p < tab.properties.length; p++) {

                    var prop = tab.properties[p];

                    if (typeof prop.value !== "function") {
                        value[prop.alias] = prop.value;
                    }
                }
            }

            return value;
        }
    }

    return services;
});
