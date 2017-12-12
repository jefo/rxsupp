import mongoose from 'mongoose';

const schema = mongoose.Schema({
    login: String,
    password: String,
    firstName: String,
    lastName: String
});

export default mongoose.model('User', schema);
