module.exports = {
    apps: [{
        name: 'jetaway-app', 
        script: '/app/jetaway/JetAway_Server/build/src/app.js',
        max_restarts: 3,      
        restart_delay: 3000
    }]
}
