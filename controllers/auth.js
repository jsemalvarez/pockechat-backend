const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario')

const { generarJWT } = require('../helpers/jwt')


const crearUsuario = async (req, res) => {

    try {

        const { email, password } = req.body

        //verificar que el email no exista
        const existeEmail = await Usuario.findOne( { email } )
        if( existeEmail ){
            return res.status(400)
                        .json({
                            ok:false,
                            msg:'El email ya existe'
                        })
        }

        const usuario = Usuario( req.body )

        // encriptar contraseña
        const salt = bcrypt.genSaltSync()
        usuario.password = bcrypt.hashSync( password, salt )

        // Guardar usuario
        await usuario.save()

        //Generar JWT
        const token = await generarJWT( usuario.id )


        res.json({
            ok:true,
            usuario,
            token
        })


    } catch (error) {
        console.log(error)
        res.status(500)
            .json({
                ok:false,
                msg:'Hable con el administrador'
            })
    }

}


const login = async (req, res) => {

    const { email, password } = req.body

    try {

        //verificar si existe el correo
        const usuarioBD = await Usuario.findOne( { email } )
        if( !usuarioBD ){
            return res.status(404)
                    .json({
                        ok: false,
                        msg: 'Email no encontrado'
                    })
        }


        //Validar el password
        const validarPassword = bcrypt.compareSync( password, usuarioBD.password )
        if( !validarPassword ){
            return res.status(400)
                    .json({
                        ok:false,
                        msg: 'Password no es correcto'
                    })
        }

        //Generar JWT
        const token = await generarJWT( usuarioBD.id )

        res.json({
            ok:true,
            usuario: usuarioBD,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500)
            .json({
                ok:false,
                msg:'Hable con el administrador'
            })
    }

   
}


const renewToken = async (req, res) => {

    const uid = req.uid

    //Generar JWT
    const token = await generarJWT( uid )

    //Obtener el usuario por UID
    const usuario = await Usuario.findById( uid )

    res.json({
        ok:true,
        usuario,
        token
    })
}


module.exports = {
    crearUsuario,
    login,
    renewToken
}