'use strict';

var core = require('@actions/core');

function _interopNamespaceDefault(e) {
	var n = Object.create(null);
	if (e) {
		Object.keys(e).forEach(function (k) {
			if (k !== 'default') {
				var d = Object.getOwnPropertyDescriptor(e, k);
				Object.defineProperty(n, k, d.get ? d : {
					enumerable: true,
					get: function () { return e[k]; }
				});
			}
		});
	}
	n.default = e;
	return Object.freeze(n);
}

var core__namespace = /*#__PURE__*/_interopNamespaceDefault(core);

const username = core__namespace.getInput('username');
console.log(`[force-sync-gitee-action]: Your username is ${username}`);
