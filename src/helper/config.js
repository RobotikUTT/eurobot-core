import nconf from 'nconf';


nconf
    .argv()
    .env()
    .file({ file: 'config.json' });


export default nconf;
