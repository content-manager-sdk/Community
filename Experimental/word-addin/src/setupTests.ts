(global as any).config = { BASE_URL: "" };
(global as any).Office = {
	context: {
		ui: { messageParent: function() {} },
	},
};

import * as enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { initializeIcons } from "@uifabric/icons";

initializeIcons();

enzyme.configure({ adapter: new Adapter() });

var localStorageMock = (function() {
	var store = {};
	return {
		getItem: function(key) {
			return store[key];
		},
		setItem: function(key, value) {
			store[key] = value.toString();
			this.length = Object.keys(store).length;
		},
		clear: function() {
			store = {};
			this.length = 0;
		},
		removeItem: function(key) {
			delete store[key];
			this.length = Object.keys(store).length;
		},
		length: 0,
		key: function(n: number) {
			let counter = 0;
			for (const prop in store) {
				if (n === counter) {
					return prop;
				}
				counter++;
			}
		},
	};
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });
