import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ProjectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState(['', '', '', '']);
  const [images, setImages] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [projectType, setProjectType] = useState('');

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handlePdfChange = (e) => {
    setPdfs([...e.target.files]);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ projectName, description, members, images, pdfs, projectType });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="projectName">
        <Form.Label>Project Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="description" className="mt-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Form.Group>

      <Row className="mt-3">
        {members.map((member, index) => (
          <Col key={index} md={6}>
            <Form.Group controlId={`member${index}`}>
              <Form.Label>Member {index + 1}</Form.Label>
              <Form.Control
                type="text"
                placeholder={`Enter member ${index + 1} name`}
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
              />
            </Form.Group>
          </Col>
        ))}
      </Row>

      <Form.Group controlId="images" className="mt-3">
        <Form.Label>Upload Images</Form.Label>
        <Form.Control
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
      </Form.Group>

      <Form.Group controlId="pdfs" className="mt-3">
        <Form.Label>Upload PDFs</Form.Label>
        <Form.Control
          type="file"
          multiple
          accept="application/pdf"
          onChange={handlePdfChange}
        />
      </Form.Group>

      <Form.Group controlId="projectType" className="mt-3">
        <Form.Label>Project Type</Form.Label>
        <div>
          <Form.Check
            type="radio"
            label="Final Year Project"
            name="projectType"
            value="Final Year Project"
            onChange={(e) => setProjectType(e.target.value)}
          />
          <Form.Check
            type="radio"
            label="Mini Project"
            name="projectType"
            value="Mini Project"
            onChange={(e) => setProjectType(e.target.value)}
          />
        </div>
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3">
        Submit
      </Button>
    </Form>
  );
};

export default ProjectForm;
