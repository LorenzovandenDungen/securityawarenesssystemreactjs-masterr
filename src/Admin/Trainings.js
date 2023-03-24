import React, { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { firestore } from '../../firebase/firebase.utils';

const Trainings = () => {
  const [training, setTraining] = useState({ name: '', questions: [] });
  const [trainings, setTrainings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentTraining, setCurrentTraining] = useState(null);

  const trainingsRef = firestore.collection('trainings');
  const query = trainingsRef.orderBy('createdAt', 'desc').limit(100);
  const [trainingsList] = useCollectionData(query, { idField: 'id' });

  useEffect(() => {
    setTrainings(trainingsList);
  }, [trainingsList]);

  const addTraining = async (e) => {
    e.preventDefault();
    const newTraining = { ...training, createdAt: new Date() };
    await trainingsRef.add(newTraining);
    setTraining({ name: '', questions: [] });
  };

  const deleteTraining = async (id) => {
    await trainingsRef.doc(id).delete();
  };

  const editTraining = (doc) => {
    setCurrentTraining(doc);
    setTraining({ name: doc.name, questions: doc.questions });
    setEditing(true);
  };

  const updateTraining = async (e) => {
    e.preventDefault();
    const updatedTraining = { ...currentTraining, name: training.name, questions: training.questions };
    await trainingsRef.doc(currentTraining.id).update(updatedTraining);
    setCurrentTraining(null);
    setTraining({ name: '', questions: [] });
    setEditing(false);
  };

  const cancelEditing = () => {
    setEditing(false);
    setCurrentTraining(null);
    setTraining({ name: '', questions: [] });
  };

  return (
    <div>
      <h2>Trainings</h2>
      {editing ? (
        <form onSubmit={updateTraining}>
          <label>
            Name:
            <input type="text" value={training.name} onChange={(e) => setTraining({ ...training, name: e.target.value })} />
          </label>
          <label>
            Questions:
            <textarea value={training.questions} onChange={(e) => setTraining({ ...training, questions: e.target.value })} />
          </label>
          <button type="submit">Update Training</button>
          <button onClick={cancelEditing}>Cancel</button>
        </form>
      ) : (
        <form onSubmit={addTraining}>
          <label>
            Name:
            <input type="text" value={training.name} onChange={(e) => setTraining({ ...training, name: e.target.value })} />
          </label>
          <label>
            Questions:
            <textarea value={training.questions} onChange={(e) => setTraining({ ...training, questions: e.target.value })} />
          </label>
          <button type="submit">Add Training</button>
        </form>
      )}
      <ul>
        {trainings &&
          trainings.map((doc) => (
            <li key={doc.id}>
              <div>
                <strong>{doc.name}</strong>
                <button onClick={() => deleteTraining(doc.id)}>Delete</button>
                <button onClick={() => editTraining(doc)}>Edit</button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Trainings;
