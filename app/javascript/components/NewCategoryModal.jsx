import React from "react";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const NewCategoryModal = ({ isOpen, onClose, onSave }) => {
  const userId = document
    .querySelector('meta[name="current-user-id"]')
    .getAttribute("content");

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoryName = e.target.elements.categoryName.value;
    const categoryColor = e.target.elements.categoryColor.value;
    try {
      fetch(`users/${userId}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": document.querySelector('[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          category: {
            name: categoryName,
            color: categoryColor,
            user_id: userId,
          },
        }),
      });
    } catch (error) {
      console.error("Error:", error);
    }
    onSave();
    onClose();
  };
  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalHeader toggle={onClose}>Nova Categoria</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          <FormGroup>
            <Label for="categoryName">Nome</Label>
            <Input type="text" name="categoryName" id="categoryName" required />
          </FormGroup>
          <FormGroup>
            <Label for="categoryColor">Cor</Label>
            <Input type="color" name="categoryColor" id="categoryColor" />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>
            Cancelar
          </Button>{" "}
          <Button color="primary" type="submit">
            Salvar
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default NewCategoryModal;
