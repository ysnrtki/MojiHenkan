$(() => {
    $("textarea[name='変換前']").val(localStorage.getItem("変換前"));
    try {
        $("select[name='変換方法']").val(JSON.parse(localStorage.getItem("変換方法") || "[]"));
    } catch(e) {
    }
    
    $("textarea[name='変換前'], select[name='変換方法']").on("blur change", function () {
        $("#変換方法テキスト").text($("select[name='変換方法']").val().join(", "));
        
        localStorage.setItem("変換前", $("textarea[name='変換前']").val());
        localStorage.setItem("変換方法", JSON.stringify($("select[name='変換方法']").val()));

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
                    //"　": " ",
                    "‘": "`",
                    "〜": "~",
                    "～": "~",
                    "”": "\"",
                    "￥": "\\",
                };
                Object.keys(map).forEach(key => line = line.replace(new RegExp(key, "g"), map[key]));
                line = trimEx(line.replace(/[ \f\n\r\t]+/g, " ").replace(/ +/g, " "));
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
        let after = before;
        ($("select[name='変換方法']").val() || []).forEach(method => {
            if (method === "大文字") {
                after = 大文字(after);
            }
            if (method === "小文字") {
                after = 小文字(after);
            }
            if (method === "コンパクト") {
                after = コンパクト(after);
            }
            if (method === "半角スペースで分割してソート") {
                after = 半角スペースで分割してソート(after);
            }
            if (method === "半角数値のみ") {
                after = after.replace(/[^0-9]/g, "");
            }
            if (method === "半角") {
                after = new Moji(after).convert("ZE", "HE").toString();
            }
            if (method === "全角") {
                after = new Moji(after).convert("HE", "ZE").toString();
            }
        });
        $("textarea[name='変換後']").val(after);
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
