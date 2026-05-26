const journalService = require('../services/journalService');

const create = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title dan description wajib diisi' });
    }

    const data = await journalService.createJournal(req.user.id, title, description, req.token);
    res.status(201).json({ success: true, message: 'Jurnal berhasil dibuat', data });
  } catch (error) {
    next(error);
  }
};

const getAll = async (req, res, next) => {
  try {
    const data = await journalService.getAllJournals(req.user.id, req.token);
    res.status(200).json({ success: true, message: 'Berhasil mengambil semua jurnal', data });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const data = await journalService.getJournalById(req.user.id, req.params.id, req.token);
    if (!data) return res.status(404).json({ success: false, message: 'Jurnal tidak ditemukan' });
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    if (error.code === '22P02') return res.status(400).json({ success: false, message: 'Format ID jurnal tidak valid' });
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const data = await journalService.updateJournal(req.user.id, req.params.id, title, description, req.token);
    
    if (!data) return res.status(404).json({ success: false, message: 'Jurnal tidak ditemukan atau gagal diupdate' });
    res.status(200).json({ success: true, message: 'Jurnal berhasil diperbarui', data });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await journalService.deleteJournal(req.user.id, req.params.id, req.token);
    res.status(200).json({ success: true, message: 'Jurnal berhasil dihapus' });
  } catch (error) {
    next(error);
  }
};

module.exports = { create, getAll, getById, update, remove };