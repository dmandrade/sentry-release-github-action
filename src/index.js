const core = require('@actions/core');
const SentryCli = require('@sentry/cli');

/**
 * Release task
 * @returns {Promise<never>}
 */
const release = async () => {
    const releaseVersion = core.getInput('version', {required: true});
    const deployEnvironment = core.getInput('environment', {required: false}) || '';
    const sentry = new SentryCli();

    await sentry.execute([
        "releases",
        "new",
        releaseVersion
    ]);
    console.log(`The release "${releaseVersion}" was sended to Sentry.`);

    await sentry.execute([
        "releases",
        "set-commits",
        "--auto",
        releaseVersion
    ]);

    if(deployEnvironment) {
        await sentry.execute([
            "releases",
            "deploys",
            releaseVersion,
            'new',
            '-e',
            deployEnvironment
        ]);
        console.log(`The release "${releaseVersion}" are associated with "${deployEnvironment}" environment.`);
    }
};


module.exports = () => {
    core.debug('Initialization successful');
    release().catch(core.setFailed);
};
