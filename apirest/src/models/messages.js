// module.exports = (sequelize, DataTypes) => {

//     const Message = sequelize.define('messages', {

//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//             allowNull: false
//         },

//         fk_sender: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             allowNull: false
//         },

//         fk_receiver: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             allowNull: false
//         },

//         message: {
//             type: DataTypes.TEXT,
//             allowNull: false
//         }
//     }, {
//         paranoid: true
//     });
//     return Message;
// };

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let messageSchema = new Schema({
    senderId: { type: Number, required: [true, 'Sender id is required'] },
    senderName: { type: String, required: [true, 'Sender name is required'] },
    receiverId: { type: Number, required: [true, 'Receiver id is required'] },
    receiverName: { type: String, required: [true, 'Receiver name is required'] },
    message: { type: String, required: [true, 'Message is required'] },
    read: { type: Boolean, required: [true, 'Read or not is required'] },
    date: { type: String, required: [true, 'Date is required'] },
    hour: { type: String, required: [true, 'Hour is required'] }
});


module.exports = mongoose.model('Message', messageSchema);
