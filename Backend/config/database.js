//provide a sensible default for local development
mongodb_connection_string = 'mongodb://127.0.0.1:27017/pethouse';
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
    mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + "pethouse";
}

module.exports = {
    'url' : mongodb_connection_string
};