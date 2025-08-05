import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";

const ticketsCollection = collection(db, "tickets");

export const ticketsService = {
  async getAllTickets() {
    try {
      const querySnapshot = await getDocs(ticketsCollection);
      const tickets = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const ticketData = docSnapshot.data();
        
        // Obtener información del evento
        try {
          const eventDoc = doc(db, "events", ticketData.eventId);
          const eventSnapshot = await getDoc(eventDoc);
          
          if (eventSnapshot.exists()) {
            const eventData = eventSnapshot.data();
            tickets.push({
              id: docSnapshot.id,
              userId: ticketData.userId,
              eventId: ticketData.eventId,
              event: {
                id: eventSnapshot.id,
                ...eventData
              },
              totalPrice: ticketData.totalPrice,
              originalPrice: ticketData.originalPrice || ticketData.totalPrice,
              discountAmount: ticketData.discountAmount || 0,
              discountPercentage: ticketData.discountPercentage || 0,
              purchaseDate: ticketData.purchaseDate,
              customerInfo: ticketData.customerInfo
            });
          }
        } catch (error) {
          console.error(`Error fetching event for ticket ${docSnapshot.id}:`, error);
        }
      }
      
      // Ordenar por fecha de compra (más reciente primero)
      return tickets.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    } catch (error) {
      console.error("Error al obtener todas las entradas:", error);
      throw error;
    }
  },

  async getTicketsByUserId(userId) {
    try {
      const q = query(ticketsCollection, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const tickets = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const ticketData = docSnapshot.data();
        
        // Obtener información del evento
        try {
          const eventDoc = doc(db, "events", ticketData.eventId);
          const eventSnapshot = await getDoc(eventDoc);
          
          if (eventSnapshot.exists()) {
            const eventData = eventSnapshot.data();
            tickets.push({
              id: docSnapshot.id,
              userId: ticketData.userId,
              eventId: ticketData.eventId,
              event: {
                id: eventSnapshot.id,
                ...eventData
              },
              totalPrice: ticketData.totalPrice,
              originalPrice: ticketData.originalPrice || ticketData.totalPrice,
              discountAmount: ticketData.discountAmount || 0,
              discountPercentage: ticketData.discountPercentage || 0,
              purchaseDate: ticketData.purchaseDate,
              customerInfo: ticketData.customerInfo
            });
          }
        } catch (error) {
          console.error(`Error fetching event for ticket ${docSnapshot.id}:`, error);
        }
      }
      
      // Ordenar por fecha de compra (más reciente primero)
      return tickets.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    } catch (error) {
      console.error("Error al obtener entradas:", error);
      throw error;
    }
  },

  async createTicket(ticketData) {
    try {
      const ticket = {
        userId: ticketData.userId,
        eventId: ticketData.eventId,
        totalPrice: ticketData.totalPrice,
        originalPrice: ticketData.originalPrice || ticketData.totalPrice, // Precio sin descuento
        discountAmount: ticketData.discountAmount || 0, // Monto del descuento aplicado
        discountPercentage: ticketData.discountPercentage || 0, // Porcentaje de descuento
        purchaseDate: new Date().toISOString(),
        customerInfo: ticketData.customerInfo
      };
      
      const docRef = await addDoc(ticketsCollection, ticket);
      return { id: docRef.id, ...ticket };
    } catch (error) {
      console.error("Error al crear entrada:", error);
      throw error;
    }
  },

  async getTicketById(ticketId) {
    try {
      const ticketDoc = doc(ticketsCollection, ticketId);
      const ticketSnapshot = await getDoc(ticketDoc);
      
      if (ticketSnapshot.exists()) {
        const ticketData = ticketSnapshot.data();
        
        // Obtener información del evento
        const eventDoc = doc(db, "events", ticketData.eventId);
        const eventSnapshot = await getDoc(eventDoc);
        
        if (eventSnapshot.exists()) {
          const eventData = eventSnapshot.data();
          return {
            id: ticketSnapshot.id,
            userId: ticketData.userId,
            eventId: ticketData.eventId,
            event: {
              id: eventSnapshot.id,
              ...eventData
            },
            totalPrice: ticketData.totalPrice,
            originalPrice: ticketData.originalPrice || ticketData.totalPrice,
            discountAmount: ticketData.discountAmount || 0,
            discountPercentage: ticketData.discountPercentage || 0,
            purchaseDate: ticketData.purchaseDate,
            customerInfo: ticketData.customerInfo
          };
        }
      }
      
      throw new Error('Entrada no encontrada');
    } catch (error) {
      console.error("Error al obtener entrada:", error);
      throw error;
    }
  },

  async deleteTicket(ticketId) {
    try {
      const ticketDoc = doc(ticketsCollection, ticketId);
      await deleteDoc(ticketDoc);
    } catch (error) {
      console.error("Error al eliminar entrada:", error);
      throw error;
    }
  },

  async getTicketsByEventId(eventId) {
    try {
      const q = query(ticketsCollection, where("eventId", "==", eventId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error al obtener entradas por evento:", error);
      throw error;
    }
  }
}; 