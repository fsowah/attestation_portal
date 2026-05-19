import React from 'react';
import { useNavigate } from 'react-router-dom';
import NewApplicationSteps from './components/NewApplicationSteps';

const NewApplicationPage = () => {
  const navigate = useNavigate();

  return (
    <NewApplicationSteps
      onBack={() => navigate('/dashboard/applications')}
      onTrack={() => navigate('/dashboard/track-status')}
    />
  );
};

export default NewApplicationPage;
