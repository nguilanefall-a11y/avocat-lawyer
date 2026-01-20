const invoices = [
    { id: 1, client: "Société Dupuis", amount: 1500, status: "LATE", dueDate: "2023-10-15", remindersSent: 2 },
    { id: 2, client: "M. Martin", amount: 450, status: "PENDING", dueDate: "2023-11-20", remindersSent: 0 },
    { id: 3, client: "TechCorp SA", amount: 3200, status: "LATE", dueDate: "2023-09-01", remindersSent: 5 },
    { id: 4, client: "Mme. Lefebvre", amount: 800, status: "PAID", dueDate: "2023-10-01", remindersSent: 1 }
];

module.exports = invoices;
