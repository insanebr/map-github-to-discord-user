const core = require("@actions/core");
const fs = require("fs");

function loadMapping({ inline, path }) {
    if (inline) {
        return inline;
    }
    if (path) {
        if (!fs.existsSync(path)) {
            throw new Error(`Mapping file not found at path: ${path}`);
        }
        return fs.readFileSync(path, "utf8");
    }
    throw new Error(
        "You must provide either mapping-json-inline or mapping-json.",
    );
}

try {
    const prAuthor = core.getInput("pr-author", { required: true }).trim();
    const inline = core.getInput("mapping-json-inline"); // optional
    const pathInput = core.getInput("mapping-json"); // optional

    const raw = loadMapping({
        inline: inline && inline.trim(),
        path: pathInput && pathInput.trim(),
    });

    let mapping;
    try {
        mapping = JSON.parse(raw);
    } catch (e) {
        core.setFailed(`Failed to parse mapping JSON: ${e.message}`);
        process.exit(1);
    }

    if (Object.prototype.hasOwnProperty.call(mapping, prAuthor)) {
        core.setOutput("discord-mention", mapping[prAuthor]);
    } else {
        core.setFailed(`No mapping found for PR author: ${prAuthor}`);
    }
} catch (err) {
    core.setFailed(err.message);
}
