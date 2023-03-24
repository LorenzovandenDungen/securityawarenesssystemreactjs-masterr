import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Table } from 'react-bootstrap';
import firebase from '../firebase';

const AdminDashboard = () => {
  const [trainings, setTrainings] = useState([]);
  const [trainingTitle, setTrainingTitle] = useState('');
  const [trainingDescription, setTrainingDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await firebase.firestore().collection('trainings').get();
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrainings(data);
    };
    fetchData();
  }, []);

  const handleCreateTraining = async (e) => {
    e.preventDefault();
    if (!trainingTitle || !trainingDescription) return;

    await firebase.firestore().collection('trainings').add({
      title: trainingTitle,
      description: trainingDescription,
    });

    setTrainingTitle('');
    setTrainingDescription('');

    const snapshot = await firebase.firestore().collection('trainings').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTrainings(data);
  };

  const handleDeleteTraining = async (id) => {
    await firebase.firestore().collection('trainings').doc(id).delete();

    const snapshot = await firebase.firestore().collection('trainings').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTrainings(data);
  };

  const handleImportUsers = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    // Your implementation of importing users from CSV file
  };

  return (
    <Container>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Create New Training</Card.Title>
              <Form onSubmit={handleCreateTraining}>
                <Form.Group controlId="formTrainingTitle">
                  <Form.Label>Training Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter training title"
                    value={trainingTitle}
                    onChange={(e) => setTrainingTitle(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formTrainingDescription">
                  <Form.Label>Training Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter training description"
                    value={trainingDescription}
                    onChange={(e) => setTrainingDescription(e.target.value)}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Create Training
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Import Users</Card.Title>
              <Form>
                <Form.File
                  id="custom-file"
                  label="Choose CSV file"
                  onChange={handleImportUsers}
                />
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Trainings List</Card.Title>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Training Title</th>
                    <th>Training Description</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {trainings.map((training, index) => (
                    <tr key={training.id}>
                      <td>{index + 1}</td>
                      <td>{training.title}</td>
                      <td>{training.description}</td>
                      <td>
                        <Button variant="danger" onClick={() => handleDeleteTraining(training.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default AdminDashboard;
