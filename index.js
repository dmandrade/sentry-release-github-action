const exec = require('./src/_exec');
const path = require('path');

const run = async () => {
    // Install Dependencies
    {
        const {stderr} = await exec('npm ci --only=prod', {
            cwd: path.resolve(__dirname)
        });
        if (stderr) {
            return Promise.reject(stderr);
        }
    }

    require('./src/index')();
};

run().catch(console.error);
