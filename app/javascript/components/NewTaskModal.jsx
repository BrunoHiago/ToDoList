// TaskModal.js
import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { createTask } from "../packs/services";

const NewTaskModal = ({ isOpen, onClose, onSave, categories }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: 0,
    categoryId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const userId = document
    .querySelector('meta[name="current-user-id"]')
    .getAttribute("content");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (taskData.categoryId !== "") {
      taskData.categoryId = taskData.categoryId?.map(
        (category) => category.value
      );
    } else {
      taskData.categoryId = [];
    }
    console.log(taskData);
    createTask(taskData, userId).then(() => {
      onSave();
      onClose();
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
      centered
    >
      <ModalHeader toggle={onClose}>Criar Nova Tarefa</ModalHeader>

      <form onSubmit={handleSubmit} style={styles.form}>
        <ModalBody>
          <FormGroup>
            <Label for="title">Título</Label>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="Título"
              value={taskData.title}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Descrição</Label>
            <Input
              id="description"
              name="description"
              placeholder="Descrição"
              value={taskData.description}
              onChange={handleChange}
              type="textarea"
            />
          </FormGroup>
          <FormGroup>
            <Label for="dueDate">Data de Vencimento</Label>

            <Input
              id="dueDate"
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="priority">Prioridade</Label>

            <Input
              id="priority"
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              type="select"
            >
              <option value={0}>Baixa</option>
              <option value={1}>Média</option>
              <option value={2}>Alta</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="categoryId">Categoria</Label>

            <Select
              id="categoryId"
              name="categoryId"
              value={taskData.categoryId}
              onChange={(e) => {
                setTaskData({ ...taskData, categoryId: e });
              }}
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              isMulti
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type="button" color="danger" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" color="primary">
            Salvar
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
  },
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
};

export default NewTaskModal;
