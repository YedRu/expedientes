import React from 'react';

const PesoEnvases = () => {
  const inputs = Array.from({ length: 15 }, (_, i) => (
    <input key={i} type="text" className="small-input" />
  ));

  return (
    <div className="form-group">
      <label>PESO DE ENVASES</label>
      <div className="input-grid">
        {inputs}
      </div>
    </div>
  );
};

export default PesoEnvases;
