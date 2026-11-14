const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['admin', 'manager', 'employee'], 
        default: 'employee' 
    },
    // Integration tokens (encrypted)...
    githubUsername: String,
    githubToken: String,
    jiraEmail: String,
    jiraDomain: String,
    jiraToken: String,
    teamsWebhookUrl: String,
    scheduledTime: { type: String, default: '10:00' },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', userSchema);