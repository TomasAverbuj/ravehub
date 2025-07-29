import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "./firebase"; // Importamos la instancia de la base de datos de Firebase

const eventsCollection = collection(db, "events");

export const eventsService = {
  async getEvents() {
    try {
      const querySnapshot = await getDocs(eventsCollection);
      const events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        img: doc.data().img,
        title: doc.data().title,
        description: doc.data().description,
        date: doc.data().date,
        location: doc.data().location,
        capacity: doc.data().capacity,
        price: doc.data().price || 0,
        userId: doc.data().userId
      }));
      return events;
    } catch (error) {
      console.error("Error al obtener eventos:", error);
      throw error;
    }
  },

  async getEventById(eventId) {
    try {
      const eventDoc = doc(eventsCollection, eventId);
      const eventSnapshot = await getDoc(eventDoc);
      if (eventSnapshot.exists()) {
        return { id: eventSnapshot.id, ...eventSnapshot.data() };
      } else {
        throw new Error('Evento no encontrado');
      }
    } catch (error) {
      console.error("Error al obtener el evento:", error);
      throw error;
    }
  },

  async addEvent(event) {
    try {
      await addDoc(eventsCollection, event);
    } catch (error) {
      console.error("Error al agregar evento:", error);
      throw error;
    }
  },

  async updateEvent(event) {
    try {
      const eventDoc = doc(eventsCollection, event.id);

      // Filtrar campos undefined o vacíos
      const updateData = Object.fromEntries(
        Object.entries(event).filter(([_, v]) => v !== undefined && v !== '')
      );

      await updateDoc(eventDoc, updateData);
    } catch (error) {
      console.error("Error al actualizar evento:", error);
      throw error;
    }
  },

  async deleteEvent(eventId) {
    try {
      const eventDoc = doc(eventsCollection, eventId);
      await deleteDoc(eventDoc);
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      throw error;
    }
  },

  async getEventsByUserId(userId) {
    try {
      const q = query(eventsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      return events;
    } catch (error) {
      console.error("Error al obtener eventos por ID de usuario:", error);
      throw error;
    }
  },

  async updateEventPrice(eventId, price) {
    try {
      const eventDoc = doc(eventsCollection, eventId);
      await updateDoc(eventDoc, { price: price });
    } catch (error) {
      console.error("Error al actualizar precio del evento:", error);
      throw error;
    }
  },

  async updateEventsWithoutPrice(defaultPrice = 0) {
    try {
      const querySnapshot = await getDocs(eventsCollection);
      const updatePromises = [];
      
      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.price === undefined || data.price === null) {
          updatePromises.push(this.updateEventPrice(doc.id, defaultPrice));
        }
      });
      
      await Promise.all(updatePromises);
      console.log(`Actualizados ${updatePromises.length} eventos sin precio`);
    } catch (error) {
      console.error("Error al actualizar eventos sin precio:", error);
      throw error;
    }
  }
};
