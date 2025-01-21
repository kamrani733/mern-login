import React, { useState, useEffect } from "react";
import axios from "axios";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/tickets", {
          withCredentials: true,
        });
        setTickets(data.tickets);
      } catch (err) {
        setError("Failed to fetch tickets");
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/tickets/${id}/status`,
        { status },
        { withCredentials: true }
      );
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket._id === id ? { ...ticket, status: data.ticket.status } : ticket
        )
      );
    } catch (err) {
      console.error("Error updating ticket status:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tickets</h2>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="p-4 border border-gray-300 rounded-md"
          >
            <p className="font-bold">{ticket.subject}</p>
            <p className="text-sm text-gray-600">{ticket.message}</p>
            <p className="text-sm">Status: {ticket.status}</p>
            <div className="mt-2">
              <button
                onClick={() => updateStatus(ticket._id, "in_progress")}
                className="bg-yellow-500 text-white py-1 px-2 rounded-md mr-2"
              >
                Mark as In Progress
              </button>
              <button
                onClick={() => updateStatus(ticket._id, "resolved")}
                className="bg-green-500 text-white py-1 px-2 rounded-md"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;