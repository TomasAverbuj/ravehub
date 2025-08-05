import { collection, addDoc, getDocs, where, query, doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase"; 

export const commentsService = {
  async getCommentsByEventId(eventId) {
    try {
      const commentsCollection = collection(db, "comments");
      const q = query(commentsCollection, where("eventId", "==", eventId));
      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Si no hay comentarios, devolver array vacío
      if (comments.length === 0) {
        return [];
      }

      const usersId = [];
      comments.forEach(comment => {
        if (!usersId.includes(comment.userId))
          usersId.push(comment.userId)
      });

      // Si no hay usuarios, devolver comentarios sin información de usuario
      if (usersId.length === 0) {
        return comments.map(comment => ({
          id: comment.id,
          text: comment.text,
          userId: comment.userId,
          created_at: comment.created_at,
          email: "",
          nombre: "",
        }));
      }

      const usersCollection = collection(db, "users");
      const qUsers = query(usersCollection, where("userId", "in", usersId));
      const querySnapshotUsers = await getDocs(qUsers);

      const users = querySnapshotUsers.docs.reduce((acc, doc) => {
        acc[doc.id] = doc.data();
        return acc;
      }, {});

      const commentsWithUsersInfo = comments.map(comment => ({
        id: comment.id,
        text: comment.text,
        userId: comment.userId,
        created_at: comment.created_at,
        email: users[comment.userId]?.email || "",
        nombre: users[comment.userId]?.nombre || "", 
      }));

      return commentsWithUsersInfo;

    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      throw error;
    }
  },

  async getCommentsByUserId(userId) {
    try {
      const commentsCollection = collection(db, "comments");
      const q = query(commentsCollection, where("userId", "==", userId));

      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const eventsId = [...new Set(comments.map(comment => comment.eventId))];

      const eventsCollection = collection(db, "events");
      const eventsPromises = eventsId.map(eventId => getDoc(doc(eventsCollection, eventId)));
      const eventsSnapshots = await Promise.all(eventsPromises);

      const events = eventsSnapshots.reduce((acc, snapshot) => {
        if (snapshot.exists()) {
          acc[snapshot.id] = snapshot.data();
        }
        return acc;
      }, {});

      const commentsWithEventInfo = comments.map(comment => ({
        ...comment,
        eventName: events[comment.eventId]?.title || "",
        eventDetails: events[comment.eventId] || {},
      }));

      const groupedComments = eventsId.map(eventId => ({
        eventId,
        eventName: events[eventId]?.title || "",
        eventDetails: events[eventId] || {},
        comments: commentsWithEventInfo.filter(comment => comment.eventId === eventId),
      }));

      return groupedComments;

    } catch (error) {
      console.error('Error al obtener comentarios del usuario:', error);
      throw error;
    }
  },

  async addComment(comment) {
    try {
      const commentsCollection = collection(db, "comments"); 
      await addDoc(commentsCollection, comment); 
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      throw error;
    }
  },

  async deleteComment(commentId) {
    try {
      const commentRef = doc(db, "comments", commentId);
      await deleteDoc(commentRef);
      console.log("Comentario eliminado:", commentId);
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      throw error;
    }
  },

  async deleteAllCommentsByEventId(eventId) {
    try {
      const commentsCollection = collection(db, "comments");
      const q = query(commentsCollection, where("eventId", "==", eventId));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log("Todos los comentarios del evento eliminados:", eventId);
    } catch (error) {
      console.error("Error al eliminar comentarios del evento:", error);
      throw error;
    }
  },
};
