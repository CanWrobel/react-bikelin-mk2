import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

interface AddIncidentProps {
  onClose: () => void;
}

const AddIncident: React.FC<AddIncidentProps> = ({ onClose }) => {
  const { username, token } = useUser();
  
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => new Date().toTimeString().split(' ')[0].slice(0, 5);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dangerLevel: 'unknown',
    category: 'good',
    date: getTodayDate(), 
    time: getCurrentTime(), 
    timeCategory: 'temporary',
    street: '',
    zip: '',
    city: '',
  });
  const [image, setImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files ? e.target.files[0] : null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append(
      'incident',
      JSON.stringify({ ...formData, username })
    );
    if (image) {
      data.append('image', image);
    }

    try {
      const response = await fetch('http://141.45.146.183:8080/bikelin/api/incident/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (response.ok) {
        console.log('Incident successfully uploaded!');
        setFormData({
          title: '',
          description: '',
          dangerLevel: 'unknown',
          category: 'good',
          date: getTodayDate(), 
          time: getCurrentTime(), 
          timeCategory: 'temporary',
          street: '',
          zip: '',
          city: '',
        });
        setImage(null);
        onClose(); 
      } else {
        console.error('Failed to upload incident:', await response.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="incident-form">
      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Description:
        <br />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Danger Level:
        <select
          name="dangerLevel"
          value={formData.dangerLevel}
          onChange={handleInputChange}
          required
        >
          <option value="unknown">Unknown</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      <label>
        Category:
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        >
          <option value="good">Good</option>
          <option value="bad">Bad</option>
        </select>
      </label>
      <label>
        Date:
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Time:
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Time Category:
        <select
          name="timeCategory"
          value={formData.timeCategory}
          onChange={handleInputChange}
          required
        >
          <option value="temporary">Temporary</option>
          <option value="semipermanent">Semi-Permanent</option>
          <option value="permanent">Permanent</option>
        </select>
      </label>
      <label>
        Street:
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        ZIP:
        <input
          type="text"
          name="zip"
          value={formData.zip}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        City:
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Image (optional):
        <input type="file" onChange={handleImageChange} />
      </label>
      <button type="submit">Submit</button>
      <button onClick={onClose}>Zurück</button>
    </form>
  );
};

export default AddIncident;
