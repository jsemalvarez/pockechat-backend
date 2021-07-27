const { Schema, model } = require('mongoose')


const MensajeSchema = Schema({

    de:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true  
    },
    para:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true  
    },
    mensaje: {
        type: String,
        reqired: true
    }
},{
    //aca le agregamos las fechas y no como atributo
    timestamps: true
})


// sobreescribimos el metodo toJson para cuando serializamos las datos
// solo mandar lo que nos interesa
MensajeSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject()
    return object
})


module.exports = model('Mensaje', MensajeSchema )