// components/ProductionHeader.jsx

import React from 'react';

const ProductionHeader = () => {
    return (
        <header className="production-header">
            {/* 1. Sección del Logo y Emisor */}
            <div className="section logo-area">
                <div className="logo-container">
                    {/* Reemplaza esto con tu componente de imagen o SVG */}
                    <div className="logo"></div>
                    <p className="logo-text">Laboratorios</p>
                </div>
            </div>

            {/* 2. Sección Central */}
            <div className="section center-area">
                <div className="top-row">
                    Procedimiento de producción
                </div>
                <div className="main-title">
                    ORDEN DE PRODUCCIÓN
                </div>
            </div>

            {/* 3. Sección de Información Derecha */}
            <div className="section info-area">
                <div className="info-row">
                    <span>Código: F-GE-PR001</span>
                </div>
                <div className="info-row">
                    <span>Revisión: 1</span>
                </div>
                <div className="info-row">
                    <span>Fecha de emisión: 19/10/2021</span>
                </div>
                <div className="info-row">
                    <span>Vigencia hasta: 19/10/2024</span>
                </div>
                <div className="info-row page-number">
                    <span>Página: 1/2</span>
                </div>
            </div>
            
            {/* Fila del Departamento Emisor */}
            <div className="emitter-row">
                Departamento Emisor: **Planificación y Compras**
            </div>
        </header>
    );
};

export default ProductionHeader;