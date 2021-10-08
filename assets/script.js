$(() => {
	$("textarea[name='変換前'], select[name='変換方法']").on("blur change", function () {
		const source = $("textarea[name='変換前']").val() || "";
		const method = $("select[name='変換方法']").val();
		if (!method) {
			return;
		}
		if (method === "大文字") {
			$("textarea[name='変換後']").val(source.toUpperCase());
		}
		if (method === "小文字") {
			$("textarea[name='変換後']").val(source.toLowerCase());
		}
		if (method === "コンパクト") {
			let result = source;
			result = result.replace(/    /g, "\t");
			result = result.replace(/ +/g, " ");
			result = result.replace(/[ \t]+$/g, "");
			const faweaf = result.split("");
			result = "";
			for (let i = 0; i < faweaf.length; i++) {
				if (i >= 2 && /^\r?\n$/.test(faweaf[i]) && /^\r?\n$/.test(faweaf[i - 1]) && /^\r?\n$/.test(faweaf[i - 2])) {
					continue;
				}
				result += faweaf[i];
			}
			$("textarea[name='変換後']").val(result);
		}
	});
});

const trimEx = value => {
	if (typeof value === "string") {
		return value.replace(/^[\s　]+|[\s　]+$/g, "");
	}
	return value;
};
