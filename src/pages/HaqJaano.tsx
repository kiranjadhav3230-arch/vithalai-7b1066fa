import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This page now redirects to the main interface with haq-jaano view
const HaqJaano: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page with haq-jaano feature open
    navigate('/', { state: { openFeature: 'haq-jaano' }, replace: true });
  }, [navigate]);

  return null;
};

export default HaqJaano;
