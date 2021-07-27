const { usuarioConectado, usuarioDesconectado, getUsuarios, grabarMensaje } = require("../controllers/sockets");
const { comprobarJWT } = require("../helpers/jwt");


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async ( socket ) => {

            const [ valido, uid ] = comprobarJWT( socket.handshake.query['x-token'] )

            if( !valido ){
                console.log('sockett no identificado')
                return socket.disconnect()
            }

            await usuarioConectado( uid )

            // Escuchar evento: mensaje-to-server
            // socket.on('mensaje-to-server', ( data ) => {
            //     console.log( data );
                
            //     this.io.emit('mensaje-from-server', data );
            // });

            //Unir al usuario a una sala de socket.io
            //En este caso, el nombre de la sala es el uid
            socket.join( uid )

            // TODO Validar JWT 
            // si el token no es valido, desconectar

            // TODO Saber que usuario esta activo mediante el UID

            // TODO Emitir todos los usuarios conectados
            this.io.emit('lista-usuarios', await getUsuarios() )

            // TODO Socket join, uid

            // TODO Escuchar cuando el cliente manda un mensaje
            socket.on('mensaje-personal', async ( payload ) => {
                const mensaje = await grabarMensaje( payload )
                //emitimos el mesaje a todos los clientes conectados a una sala
                // con el nombre del uid que esta en payload.para
                this.io.to( payload.para ).emit('mensaje-personal', mensaje )
                this.io.to( payload.de ).emit('mensaje-personal', mensaje )
            })

            //TODO Desconectado
            //Marcar en la BD que el usuario de desconecto
            //TODO: Emitir todos los usuarios conectados 
            socket.on('disconnect', async () => {
                await usuarioDesconectado( uid )
                this.io.emit('lista-usuarios', await getUsuarios() )
            })
            
        
        });
    }


}


module.exports = Sockets;