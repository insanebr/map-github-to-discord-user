const core = require('@actions/core');
const fs = require('fs');

try {
  const prAuthor = core.getInput('pr-author');
  const mappingJsonPath = core.getInput('mapping-json');

  // Read the file contents
  const mappingJson = fs.readFileSync(mappingJsonPath, 'utf8');

  try {
    const mapping = JSON.parse(mappingJson);

    if (mapping[prAuthor]) {
      const mappedValue = mapping[prAuthor];
      core.setOutput('discord-mention', mappedValue);
    } else {
      core.setFailed(`No mapping found for PR author: ${prAuthor}`);
    }
  } catch (jsonError) {
    core.setFailed(`Failed to parse mapping JSON: ${jsonError.message}`);
  }
} catch (fileError) {
  core.setFailed(`Failed to read mapping JSON file: ${fileError.message}`);
}
