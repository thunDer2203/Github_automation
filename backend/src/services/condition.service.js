export function checkConditions(conditions, payload) {

    if (!conditions.length) {
        return true;
    }

    const issue = payload.issue || payload.pull_request;

    for (const condition of conditions) {

        let fieldValue = "";

        switch (condition.field) {

            case "TITLE":
                fieldValue = issue.title || "";
                break;

            case "BODY":
                fieldValue = issue.body || "";
                break;

            case "AUTHOR":
                fieldValue = issue.user.login || "";
                break;

            case "LABEL":
                fieldValue = issue.labels
                    .map(label => label.name)
                    .join(",");
                break;

            default:
                continue;
        }

        switch (condition.operator) {

            case "CONTAINS":
                if (
                    !fieldValue
                        .toLowerCase()
                        .includes(condition.value.toLowerCase())
                ) {
                    return false;
                }
                break;

            case "EQUALS":
                if (
                    fieldValue.toLowerCase() !==
                    condition.value.toLowerCase()
                ) {
                    return false;
                }
                break;

            case "STARTS_WITH":
                if (
                    !fieldValue
                        .toLowerCase()
                        .startsWith(condition.value.toLowerCase())
                ) {
                    return false;
                }
                break;

            case "ENDS_WITH":
                if (
                    !fieldValue
                        .toLowerCase()
                        .endsWith(condition.value.toLowerCase())
                ) {
                    return false;
                }
                break;

            default:
                return false;
        }
    }

    return true;
}