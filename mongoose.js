const { codeSchema } = require('./schemas/code-schema.js');
const { dblink } = require('./json/config.json');
const mongoose = require('mongoose');

mongoose.connect(dblink);

function toModel(name, schema) {
	return mongoose.model(name, schema);
}

async function insertNew(model, data, collection) {
	const newModel = new model(data, collection);
	return await newModel.save();
}

async function addCode(code, category, data) {
	return await insertNew(toModel('Code', codeSchema), { code, category, data }, 'codes');
}

async function getCode(code) {
	return await toModel('Code', codeSchema).findOne({ code });
}

async function deleteCode(code) {
	return await toModel('Code', codeSchema).deleteOne({ code });
}

async function setUsed(code, interaction) {
	return await toModel('Code', codeSchema).findOneAndUpdate({ code }, { usedBy: `<@${interaction.user.id}>` });
}

async function isCodeUsed(code) {
	const codeData = await getCode(code);
	return codeData.usedBy !== 'Nobody';
}

async function getCodesAll() {
	return await toModel('Code', codeSchema).find({});
}

async function getCodesUnUsed() {
	return await toModel('Code', codeSchema).find({ usedBy: 'Nobody' });
}

async function getCodesUsed() {
	return await toModel('Code', codeSchema).find({ usedBy: { $ne: 'Nobody' } });
}

async function getCodesCategory(category) {
	return await toModel('Code', codeSchema).find({ category });
}

module.exports = { addCode, getCode, deleteCode, setUsed, getCodesAll, getCodesUnUsed, getCodesUsed, getCodesCategory, isCodeUsed };
