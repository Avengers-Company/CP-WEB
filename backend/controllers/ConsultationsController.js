// controllers/consultationsController.js

const db = require('../db/database');

// Obter consultas com base na role do usuário
const getAllConsultations = (req, res) => {
  const userId = req.query.userId; // Obtém o userId da query string
  const userRole = req.query.role; // Obtém a role do usuário da query string

  if (!userId) {
    return res.status(400).json({ error: 'userId é obrigatório' });
  }

  // Se o usuário for admin, busca todas as consultas
  let sql;
  const params = [];

  if (userRole === 'admin') {
    sql = `SELECT consultations.*, users.username FROM consultations 
            JOIN users ON consultations.userId = users.id`;
  } else {
    // Se o usuário não for admin, busca apenas suas consultas
    sql = `SELECT consultations.*, users.username FROM consultations 
            JOIN users ON consultations.userId = users.id 
            WHERE consultations.userId = ?`;
    params.push(userId);
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ consultations: rows });
  });
};

// Criar uma nova consulta
const createConsultation = (req, res) => {
  const { userId, date, doctor, specialty, status } = req.body;
  const sql = `INSERT INTO consultations (userId, date, doctor, specialty, status) 
               VALUES (?, ?, ?, ?, ?)`;
  const params = [userId, date, doctor, specialty, status];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({
      message: 'Consulta criada com sucesso!',
      consultationId: this.lastID
    });
  });
};

const updateConsultation = (req, res) => {
  const { id } = req.params;
  const { date, doctor, specialty, status, userId } = req.body;

  const sql = `UPDATE consultations SET date = ?, doctor = ?, specialty = ?, status = ?, userId = ? WHERE id = ?`;
  const params = [date, doctor, specialty, status, userId, id];
  db.run(sql, params, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Consulta atualizada com sucesso.' });
  });
};

module.exports = { getAllConsultations, createConsultation, updateConsultation };
