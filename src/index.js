const core = require('@actions/core');
const SentryCli = require('@sentry/cli');
const sentry = new SentryCli();

/**
 * Release task
 * @returns {Promise<never>}
 */
const release = async () => {
    const authToken = core.getInput('auth-token', {required: true});
    const sentryUrl = core.getInput('url', {required: true}) || 'https://sentry.io/';
    const sentryOrg = core.getInput('org', {required: true});
    const sentryProject = core.getInput('project', {required: true});
    const releaseVersion = core.getInput('version', {required: true});
    const deployEnvironment = core.getInput('environment', {required: false}) || '';

    const exec = async (arguments) => {
        await sentry.execute(arguments.concat([
            "--auth-token",
            authToken,
            "--url",
            sentryUrl,
            "--org",
            sentryOrg,
            "--project",
            sentryProject
        ]));
    }

    await exec([
        "releases",
        "new",
        releaseVersion
    ]);
    core.debug(`The release "${releaseVersion}" was sended to Sentry.`);

    await exec([
        "releases",
        "set-commits",
        "--auto",
        releaseVersion
    ]);
    core.debug(`Commits are associated with release "${releaseVersion}".`);

    if(deployEnvironment) {
        await exec([
            "releases",
            "deploys",
            releaseVersion,
            'new',
            '-e',
            deployEnvironment
        ]);
        core.debug(`The release "${releaseVersion}" are associated with "${deployEnvironment}" environment.`);
    }
};


module.exports = () => {
    core.debug('Initialization successful');
    release().catch(core.setFailed);
};
