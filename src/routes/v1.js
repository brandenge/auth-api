'use strict';

const express = require('express');
const dataModules = require('../models');

const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/:model', handleGetAll);
router.get('/:model/:id', handleGetOne);
router.post('/:model', handleCreate);
router.put('/:model/:id', handleUpdate);
router.delete('/:model/:id', handleDelete);

async function handleGetAll(req, res, next) {
  try {
    const allRecords = await req.model.read();
    res.status(200).json(allRecords);
  } catch (e) {
    console.error('Error in handleGetAll:', e.message);
    next(e);
  }
}

async function handleGetOne(req, res, next) {
  try {
    const record = await req.model.read(req.params.id);
    res.status(200).json(record);
  } catch (e) {
    console.error('Error in handleGetOne:', e.message);
    next(e);
  }
}

async function handleCreate(req, res, next) {
  try {
    const newRecord = await req.model.create(req.body);
    res.status(201).json(newRecord);
  } catch (e) {
    console.error('Error in handleCreate:', e.message);
    next(e);
  }
}

async function handleUpdate(req, res, next) {
  try {
    const id = req.params.id;
    const obj = req.body;
    const updatedRecord = await req.model.update(id, obj);
    res.status(200).json(updatedRecord);
  } catch (e) {
    console.error('Error in handleUpdate:', e.message);
    next(e);
  }
}

async function handleDelete(req, res, next) {
  try {
    const deletedRecord = await req.model.delete(req.params.id);
    res.status(200).json(deletedRecord);
  } catch (e) {
    console.error('Error in handleDelete:', e.message);
    next(e);
  }
}

module.exports = router;
