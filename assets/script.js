$(() => {
	$("textarea[name='変換前'], select[name='変換方法']").toArray().forEach(field => $(field).val(localStorage.getItem($(field).attr("name"))));
	$("textarea[name='変換前'], select[name='変換方法']").on("blur change", function () {
		$("textarea[name='変換前'], select[name='変換方法']").toArray().forEach(field => localStorage.setItem($(field).attr("name"), $(field).val()));
		const before = $("textarea[name='変換前']").val() || "";
		const method = $("select[name='変換方法']").val();
		if (!method) {
			return;
		}

		const 大文字 = () => $("textarea[name='変換後']").val(before.toUpperCase());
		const 小文字 = () => $("textarea[name='変換後']").val(before.toLowerCase());
		const コンパクト = () => {
			let after = trimEx(before);
			after = after.replace(/    /g, "\t");
			after = after.replace(/ +/g, " ");
			after = after.replace(/[ \t]+(\r?\n)/g, "$1");
			const splitted = after.split("");
			after = "";
			for (let i = 0; i < splitted.length; i++) {
				if (i >= 2 && /^\r?\n$/.test(splitted[i]) && /^\r?\n$/.test(splitted[i - 1]) && /^\r?\n$/.test(splitted[i - 2])) {
					continue;
				}
				after += splitted[i];
			}
			{
				after = after.replace(/[！-～]/g, str => String.fromCharCode(str.charCodeAt(0) - 0xFEE0));
				const map = {
					"’": "'",
					"－": "-",
					"‐": "-",
					"―": "-",
					"　": " ",
					"‘": "`",
					"〜": "~",
					"～": "~",
					"”": "\"",
					"￥": "\\",
				};
				Object.keys(map).forEach(key => after = after.replace(key, map[key]));
			}
			$("textarea[name='変換後']").val(after);
		};

		if (method === "大文字") {
			大文字();
		}
		if (method === "小文字") {
			小文字();
		}
		if (method === "コンパクト") {
			コンパクト();
		}
		if (method === "大文字 + コンパクト") {
			大文字();
			コンパクト();
		}
		if (method === "小文字 + コンパクト") {
			小文字();
			コンパクト();
		}
	}).filter(":first").blur();
	$("textarea[name='変換前'], textarea[name='変換後']").on("focus", function () {
		this.select();
	});
});

const trimEx = value => {
	if (typeof value === "string") {
		return value.replace(/^[\s　]+|[\s　]+$/g, "");
	}
	return value;
};
