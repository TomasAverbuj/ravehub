/*
# Estructura de los chats privados en Firestore
Crear un chat privado entre dos usuarios requiere llevar un registro de:
a. Los usuarios que pertenecen a la conversación.
b. La lista de mensajes.

Los usuarios van a ser siempre 2 en nuestro caso.
Los mensajes pueden ser n.

¿Cómo nos conviene estructurar eso en Firestore?
https://firebase.google.com/docs/firestore/manage-data/structure-data

En ese documento, nos menciona de 3 alternativas:
1. Usar mapas (objetos) o arrays para guardar datos en el propio documento.
2. Usar subcollections.
3. Usar múltiples collections independientes en la raíz de la base.

Según lo que podemos ver de las pros y contras, podemos definir:
a. Para los usuarios nos conviene utilizar un mapa o array.
b. Para los mensajes, por su parte, nos conviene utilizar subcollections.

## Cómo queda la estructura
[C] => Collection
[D] => Document

[C] 'private-chats' {
    [D] idPrivateChat {
        // Los usuarios los guardamos como un mapa donde las claves son los
        // ids de los usuarios.
        users: {
            idUser1: true,
            idUser2: true,
        }

        [C] messages {
            [D] idMessage { 
                senderId: idUser1,
                email: '...',
                content: '...',
                created_at: serverTimestamp(),

            }

            ...
        }
    }

    ...
}

Para simplificar el proceso de creación y lectura del chat privado, vamos a hacer que el id
del chat privado sea la combinación ordenada de los dos ids de los usuarios participantes.
Esta combinación va a unirse con un "_".

Por ejemplo, si los ids son:
- asd
- zxc

El id del chat será: asd_zxc
*/
export async function sendPrivateChatMessage({senderId, receiverId, content}) {
    // ...
}

export async function subscribeToPrivateChat(senderId, receiverId, callback) {
    // ...
}