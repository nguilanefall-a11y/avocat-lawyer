const documents = [
    { id: 1, client: "Société Dupuis", docType: "K-Bis", status: "VALID", requiredFor: "Dossier #123" },
    { id: 2, client: "Société Dupuis", docType: "Statuts", status: "MISSING", requiredFor: "Dossier #123" },
    { id: 3, client: "M. Martin", docType: "Pièce d'identité", status: "PENDING", requiredFor: "Divorce" },
    { id: 4, client: "TechCorp SA", docType: "Contrat de travail", status: "MISSING", requiredFor: "Prud'hommes" }
];

module.exports = documents;
