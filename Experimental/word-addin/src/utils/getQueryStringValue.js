export const getQueryStringValue = function(key: string) {
	return decodeURIComponent(
		window.location.search.replace(
			new RegExp(
				"^(?:.*[&\\?]" +
					encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") +
					"(?:\\=([^&]*))?)?.*$",
				"i"
			),
			"$1"
		)
	);
};
