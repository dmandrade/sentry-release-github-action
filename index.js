const exec = require('@actions/exec');
const core = require('@actions/core');

const run = async () => {
    try {
        const baseCommand = 'npx sentry-cli releases';
        const commandOptions = {
            failOnStdErr: true,
        };
        const releaseVersion = core.getInput('version', {required: true});
        const deployEnvironment = core.getInput('environment', {required: false}) || '';

        await exec.exec(baseCommand, [
            "new",
            releaseVersion
        ], commandOptions);
        core.debug(`The release "${releaseVersion}" was sended to Sentry.`);

        await exec.exec(baseCommand, [
            "set-commits",
            "--auto",
            releaseVersion
        ], commandOptions);
        core.debug(`Commits are associated with release "${releaseVersion}".`);

        if (deployEnvironment) {
            await exec.exec(baseCommand, [
                "deploys",
                releaseVersion,
                'new',
                '-e',
                deployEnvironment
            ], commandOptions);
            core.debug(`The release "${releaseVersion}" are associated with "${deployEnvironment}" environment.`);
        }
    }
    catch (error) {
        core.setFailed(error.message);
    }
};

run();
