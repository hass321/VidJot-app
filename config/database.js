if(process.env.NODE_ENV === 'production'){
    module.exports = {
        mongoURI: "mongodb://Hassan:mlabHassan321@ds021694.mlab.com:21694/vidjot-db"
    }
}else{
    module.exports = {
        mongoURI: "mongodb://localhost/vidjot-app"
    }
}