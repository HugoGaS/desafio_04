import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

const Grade = db.grade;

const create = async (req, res) => {
  try {
    const grade = new Grade({
      name: req.body.name,
      subject: req.body.subject,
      type: req.body.type,
      source: req.body.source,
      value: req.body.value,
      lastModified: new Date().toISOString(),
    });
    const data = await grade.save(grade);

    res.send({ message: 'Grade inserida com sucesso' });
    logger.info(`POST /grade - ${JSON.stringify(grade)}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const data = await Grade.find();
  res.send(data);

  try {
    res.send();
    logger.info(`GET /grade`);
  } catch (error) {
    res
      .status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const filter = { _id: id };
    let resultado = await Grade.findById({ _id: id });

    if (!resultado) {
      throw new Error("Grade não existente!");
    }
    res.send(resultado);

    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar o Grade id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Dados para atualizacao vazio',
    });
  }

  const id = req.params.id;
  try {
    const data = await Grade.findByIdAndUpdate({ _id: id }, req.body);
    if (!data) {
      res.send(`Grade id ${id} nao encontrado`);
    } else {
      const data = await Grade.findById({ _id: id });
      res.send({ message: 'Grade atualizado com sucesso' }, data);
    }

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(data)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar a Grade id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await Grade.findByIdAndRemove({ _id: id });
    res.send({ message: 'Grade excluido com sucesso' });

    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res
      .status(500)
      .send({ message: 'Nao foi possivel deletar o Grade id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await Grade.removeAll();
    res.send({
      message: `Grades excluidos`,
    });
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir todos as Grades' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
