$(() => {
	$("textarea[name='変換前'], select[name='変換方法']").toArray().forEach(field => $(field).val(localStorage.getItem($(field).attr("name"))));
	$("textarea[name='変換前'], select[name='変換方法']").on("blur change", function () {
		$("textarea[name='変換前'], select[name='変換方法']").toArray().forEach(field => localStorage.setItem($(field).attr("name"), $(field).val()));
		const before = $("textarea[name='変換前']").val() || "";
		const method = $("select[name='変換方法']").val();
		if (!method) {
			return;
		}
		const 大文字 = str => str.toUpperCase();
		const 小文字 = str => str.toLowerCase();
		const コンパクト = str => {
			let result = trimEx(str);
			result = result.split(/\r?\n/).map(line => {
				let indent = "";
				{
					const indentedPattern = /^([　\t]+|( {4})+)(.+)/;
					if (indentedPattern.test(line)) {
						indent = line.replace(indentedPattern, "$1").replace(/ {4}/g, "\t");
						line = line.replace(indentedPattern, "$3");
					}
				}
				line = line.replace(/[！-～]/g, str => String.fromCharCode(str.charCodeAt(0) - 0xFEE0));
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
				Object.keys(map).forEach(key => line = line.replace(new RegExp(key, "g"), map[key]));
				line = trimEx(line.replace(/\s+/g, " ").replace(/ +/g, " "));
				return `${indent}${line}`;
			}).join("\n");
			result = result.replace(/\n{3,}/g, "\n\n");
			return result;
		};
		const 半角スペースで分割してソート = str => {
			const splitted = str.split(" ");
			splitted.sort((a, b) => a.localeCompare(b));
			return splitted.join(" ");
		};
		if (method === "大文字") {
			$("textarea[name='変換後']").val(大文字(before));
		}
		if (method === "小文字") {
			$("textarea[name='変換後']").val(小文字(before));
		}
		if (method === "コンパクト") {
			$("textarea[name='変換後']").val(コンパクト(before));
		}
		if (method === "大文字 + コンパクト") {
			$("textarea[name='変換後']").val(コンパクト(大文字(before)));
		}
		if (method === "小文字 + コンパクト") {
			$("textarea[name='変換後']").val(コンパクト(小文字(before)));
		}
		if (method === "半角スペースで分割してソート") {
			$("textarea[name='変換後']").val(半角スペースで分割してソート(before));
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
