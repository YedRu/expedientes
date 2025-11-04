import React from 'react';

const ProductionHeader = () => {
    const manejarCheckbox = (checkbox) => {
        const row = checkbox.closest('tr');
        if (row) {
            const checkboxes = row.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
        }
    };

    return (
        <div className="orden-produccion">
            <form id="ordenForm">
                <div className="cabecera">
                    <div className="logo-y-departamento">
                        <div className="logo">Laboratorios</div>
                        <p className="departamento">Departamento Emisor: Planificación y Compras</p>
                    </div>
                    <div className="titulo-y-procedimiento">
                        <p className="procedimiento">Procedimiento de producción</p>
                        <h1 className="titulo-principal">ORDEN DE PRODUCCIÓN</h1>
                    </div>
                    <div className="info-documento">
                        <p>Código: F-QE-PR-001</p>
                        <p>Revisión: 1</p>
                        <p>Fecha de emisión: 19/10/2021</p>
                        <p>Vigencia hasta: 19/10/2024</p>
                        <p>Página: 1/2</p>
                    </div>
                </div>

                <div className="seccion-orden-planificacion">
                    <h2>ORDEN DE PLANIFICACIÓN</h2>
                    <table className="tabla-planificacion">
                        <tbody>
                            <tr>
                                <td className="etiqueta">Nº Lote:</td>
                                <td className="valor"><input type="text" name="nroLote" defaultValue="0" className="input-display" readOnly /></td>
                                <td className="etiqueta descripcion-producto-label" colSpan="2">Descripción Producto</td>
                                <td className="etiqueta status-label">Status:</td>
                            </tr>
                            <tr>
                                <td className="etiqueta">Orden:</td>
                                <td className="valor"><input type="text" name="orden" defaultValue="#N/D" className="input-display" readOnly /></td>
                                <td className="valor descripcion-producto-valor" colSpan="2" rowSpan="2">
                                    <input type="text" name="descripcionProducto" defaultValue="#N/D" className="input-display-center input-large" readOnly />
                                </td>
                                <td className="status-circulo" rowSpan="4"></td>
                            </tr>
                            <tr>
                                <td className="etiqueta">Código Producto:</td>
                                <td className="valor"><input type="text" name="codigoProducto" defaultValue="#N/D" className="input-display" readOnly /></td>
                            </tr>
                            <tr>
                                <td className="etiqueta">Fecha Emisión</td>
                                <td className="valor"><input type="date" name="fechaEmision" defaultValue="2025-11-03" className="input-editable" /></td>
                                <td className="etiqueta registro-sanitario-label">Registro Sanitario:</td>
                                <td className="valor registro-sanitario-valor"><input type="text" name="registroSanitario" defaultValue="N/A" className="input-display" readOnly /></td>
                            </tr>
                            <tr>
                                <td className="etiqueta">Cantidad a Producir (Kg):</td>
                                <td className="valor cantidad-a-producir"><input type="number" name="cantidadProducir" defaultValue="#N/D" className="input-editable input-bold" required /></td>
                                <td className="etiqueta nro-formula-label" colSpan="2">Nro Fórmula: <input type="text" name="nroFormula" defaultValue="N/A" className="input-display-inline" readOnly /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="seccion-presentaciones">
                    <h2>PRESENTACIONES</h2>
                    <table className="tabla-presentaciones">
                        <tbody>
                            <tr>
                                <td className="etiqueta orden-empaque-label">Orden de Empaque 1:</td>
                                <td className="valor orden-empaque-num"><input type="text" name="ordenEmpaque1" defaultValue="0" className="input-editable" /></td>
                                <td className="etiqueta presentacion-label">Presentación:</td>
                                <td className="valor presentacion-detalle"><input type="text" name="presentacion1" className="input-editable input-large" /></td>
                                <td className="etiqueta unidades-label">Unidades a Producir:</td>
                                <td className="valor unidades-num"><input type="number" name="unidades1" className="input-editable input-bold" /></td>
                            </tr>
                            <tr>
                                <td className="etiqueta orden-empaque-label">Orden de Empaque 2:</td>
                                <td className="valor orden-empaque-num"><input type="text" name="ordenEmpaque2" className="input-editable" /></td>
                                <td className="etiqueta presentacion-label">Presentación:</td>
                                <td className="valor presentacion-detalle"><input type="text" name="presentacion2" className="input-editable input-large" /></td>
                                <td className="etiqueta unidades-label">Unidades a Producir:</td>
                                <td className="valor unidades-num"><input type="number" name="unidades2" className="input-editable input-bold" /></td>
                            </tr>
                            <tr>
                                <td className="etiqueta orden-empaque-label">Orden de Empaque 3:</td>
                                <td className="valor orden-empaque-num"><input type="text" name="ordenEmpaque3" className="input-editable" /></td>
                                <td className="etiqueta presentacion-label">Presentación:</td>
                                <td className="valor presentacion-detalle"><input type="text" name="presentacion3" className="input-editable input-large" /></td>
                                <td className="etiqueta unidades-label">Unidades a Producir:</td>
                                <td className="valor unidades-num"><input type="number" name="unidades3" className="input-editable input-bold" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="seccion-despeje">
                    <h2>DESPEJE DE ÁREA DE PESADA</h2>
                    <p className="subtitulo">Verifique su conformidad o inconformidad (marque con una X)</p>
                    <table className="tabla-despeje">
                        <thead>
                            <tr>
                                <th style={{ width: '5%' }}></th>
                                <th style={{ width: '75%', textAlign: 'left' }}></th>
                                <th style={{ width: '10%' }}>Conforme</th>
                                <th style={{ width: '10%' }}>Inconforme</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td colSpan="4" className="categoria">Medio Ambiente</td></tr>
                            <tr data-id="1"><td>1</td><td className="condicion">Pisos, paredes, ventanas, puertas, techos limpios y libre de polvo</td><td><input type="checkbox" name="c-1" value="conforme" onClick={(e) => manejarCheckbox(e.target)} /></td><td><input type="checkbox" name="i-1" value="inconforme" onClick={(e) => manejarCheckbox(e.target)} /></td></tr>
                            <tr data-id="2"><td>2</td><td className="condicion">Iluminación adecuada</td><td><input type="checkbox" name="c-2" value="conforme" onClick={(e) => manejarCheckbox(e.target)} /></td><td><input type="checkbox" name="i-2" value="inconforme" onClick={(e) => manejarCheckbox(e.target)} /></td></tr>
                            <tr data-id="3"><td>3</td><td className="condicion">Temperatura adecuada</td><td><input type="checkbox" name="c-3" value="conforme" onClick={(e) => manejarCheckbox(e.target)} /></td><td><input type="checkbox" name="i-3" value="inconforme" onClick={(e) => manejarCheckbox(e.target)} /></td></tr>
                            <tr data-id="4"><td>4</td><td className="condicion">Ventilación adecuada</td><td><input type="checkbox" name="c-4" value="conforme" onClick={(e) => manejarCheckbox(e.target)} /></td><td><input type="checkbox" name="i-4" value="inconforme" onClick={(e) => manejarCheckbox(e.target)} /></td></tr>
                        </tbody>
                        <tbody>
                            <tr><td colSpan="2" className="categoria">Personal</td><td className="categoria">Conforme</td><td className="categoria">Inconforme</td></tr>
                            <tr data-id="5"><td>5</td><td className="condicion">Personal correctamente uniformado (Uniforme y Botas Seguridad)</td><td><input type="checkbox" name="c-5" value="conforme" onClick={(e) => manejarCheckbox(e.target)} /></td><td><input type="checkbox" name="i-5" value="inconforme" onClick={(e) => manejarCheckbox(e.target)} /></td></tr>
                            <tr data-id="6"><td>6</td><td className="condicion">Uso de mascarilla</td><td><input type="checkbox" name="c-6" value="conforme" onClick={(e) => manejarCheckbox(e.target)} /></td><td><input type="checkbox" name="i-6" value="inconforme" onClick={(e) => manejarCheckbox(e.target)} /></td></tr>
                            <tr data-id="7"><td>7</td><td className="condicion">Uso de tapones de seguridad</td><td><input type="checkbox" name="c-7" value="conforme" onClick={(e) => manejarCheckbox(e.target)} /></td><td><input type="checkbox" name="i-7" value="inconforme" onClick={(e) => manejarCheckbox(e.target)} /></td></tr>
                            <tr data-id="8"><td>8</td><td className="condicion">Lentes de seguridad</td><td><input type="checkbox" name="c-8" value="conforme" onClick={(e) => manejarCheckbox(e.target)} /></td><td><input type="checkbox" name="i-8" value="inconforme" onClick={(e) => manejarCheckbox(e.target)} /></td></tr>
                            <tr data-id="9"><td>9</td><td className="condicion">Guantes de nitrilo</td><td><input type="checkbox" name="c-9" value="conforme" onClick={(e) => manejarCheckbox(e.target)} /></td><td><input type="checkbox" name="i-9" value="inconforme" onClick={(e) => manejarCheckbox(e.target)} /></td></tr>
                            <tr data-id="10"><td>10</td><td className="condicion">Higiene personal, manos y uñas</td><td><input type="checkbox" name="c-10" value="conforme" onClick={(e) => manejarCheckbox(e.target)} /></td><td><input type="checkbox" name="i-10" value="inconforme" onClick={(e) => manejarCheckbox(e.target)} /></td></tr>
                            <tr data-id="11"><td>11</td><td className="condicion">Personal no utiliza ningún tipo de prendas (zarcillos, reloj, cadenas, etc)</td><td><input type="checkbox" name="c-11" value="conforme" onClick={(e) => manejarCheckbox(e.target)} /></td><td><input type="checkbox" name="i-11" value="inconforme" onClick={(e) => manejarCheckbox(e.target)} /></td></tr>
                        </tbody>
                        <tbody>
                            <tr className="responsable-fila">
                                <td colSpan="2" className="etiqueta">Responsable: <input type="text" name="responsable" className="input-editable-inline" /></td>
                                <td colSpan="2" className="valor">Fecha: <input type="date" name="fechaResponsable" className="input-editable-inline" /></td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="observaciones">
                        <p className="etiqueta">Observaciones:</p>
                        <textarea name="observaciones" className="caja-observaciones"></textarea>
                    </div>

                    <div className="footer-despeje"><input type="text" name="pieDespeje1" defaultValue="#N/D" className="input-display-footer" readOnly /> <input type="text" name="pieDespeje2" defaultValue="#N/D" className="input-display-footer" readOnly /></div>
                </div>

                <div className="seccion-validacion">
                    <h2>VALIDACIÓN</h2>
                    <table className="tabla-validacion">
                        <tbody>
                            <tr>
                                <td className="etiqueta">Producción</td>
                                <td className="etiqueta">Control de Calidad</td>
                                <td className="etiqueta">Director Técnico</td>
                            </tr>
                            <tr>
                                <td className="valor-firma"></td>
                                <td className="valor-firma"></td>
                                <td className="valor-firma"></td>
                            </tr>
                            <tr>
                                <td className="etiqueta-fecha">Fecha: <input type="date" name="fechaProduccion" className="input-editable-inline" /></td>
                                <td className="etiqueta-fecha">Fecha: <input type="date" name="fechaControlCalidad" className="input-editable-inline" /></td>
                                <td className="etiqueta-fecha">Fecha: <input type="date" name="fechaDirectorTecnico" className="input-editable-inline" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <button type="submit" className="boton-guardar">Guardar Orden</button>
            </form>
        </div>
    );
};

export default ProductionHeader;