import { promises as fs } from 'fs';
import path from 'path';

async function getPuppeteer() {
    try {
        return await import('puppeteer');
    } catch (e) {
        try {
            return await import('puppeteer-core');
        } catch (e2) {
            return null;
        }
    }
}

const getStyles = () => `
<style>
    /* --- Configuración General --- */
    body {
        font-family: Arial, sans-serif;
        font-size: 8pt;
        margin: 0;
        
    }
    .document-container {
        width: 180mm;
        margin: 20px auto;
        border: 1.5px solid #000;
        background-color: #fff;
    }
    .main-table {
        width: 100%;
        border-collapse: collapse;
    }
    .main-table th,
    .main-table td {
        border: 1px solid #000;
        padding: 3px 5px;
        vertical-align: top;
        height: 1.2em;
    }
    .control-peso-table th, .control-peso-table td {
        padding-top: 1px;
        padding-bottom: 1px;
    }
    .section-title {
        background-color: #d9d9d9;
        font-weight: bold;
        text-align: center;
        padding: 2px;
        border-top: 1px solid #000;
        border-radius: 12px;
    }
    .label {
        font-weight: bold;
        font-size: 7pt;
        display: block;
    }
    .data {
        font-size: 9pt;
        font-weight: bold;
    }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .no-border { border: none !important; }
    .no-border-top { border-top: none !important; }
    .no-border-bottom { border-bottom: none !important; }
    .border-right { border-right: 1px solid #000 !important; }

    /* --- Estilos de la Cabecera (copiados de orden.js) --- */
    .production-header {
        display: table;
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        border: 1px solid #000;
    }
    .production-header > div {
        display: table-row;
    }
    .production-header .section {
        display: table-cell;
        border: 1px solid #000;
        padding: 0;
        vertical-align: top;
    }
    .logo-area {
        width: 25%;
        height: 60px;
        text-align: center;
        padding: 5px;
        border-bottom: none !important;
    }
    .logo-container {
        padding-top: 5px;
    }
    .logo-text {
        font-size: 1.2em;
        font-weight: bold;
        color: #4CAF50;
    }
    .center-area {
        width: 50%;
        border-left: none;
        border-right: none;
        padding: 0;
        height: 60px;
    }
    .center-content {
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .top-row {
        flex: 1;
        text-align: center;
        font-size: 0.9em;
        font-weight: normal;
        padding: 3px 5px;
        border-bottom: 1px solid #000;
    }
    .main-title {
        flex: 2;
        text-align: center;
        font-size: 1.3em;
        font-weight: bold;
        color: #333;
        padding: 5px;
    }
    .info-area {
        width: 25%;
        border-left: none;
        border-right: 1px solid #000;
        padding: 0;
        height: 60px;
        text-align: center;
    }
    .info-row {
        padding: 3px 5px;
        font-size: 0.8em;
        border-bottom: 1px solid #000;
        height: 15px;
        box-sizing: border-box;
    }
    .info-row:last-child {
        border-bottom: none;
    }
    .emitter-row {
        display: table-row;
    }
    .emitter-cell {
        padding: 5px;
        font-size: 0.8em;
        background-color: #f0f0f0;
        font-weight: bold;
        border: 1px solid #000;
    }
    
    /* 2. Planificación */
    .planificacion-table .data-large {
        font-size: 10pt;
        font-weight: bold;
        text-align: center;
        vertical-align: middle;
    }

    /* 3. Despeje de Área */
    .despeje-table th, .despeje-table td {
        font-size: 7pt;
        padding: 2px 4px;
        vertical-align: middle;
    }
    .despeje-table .item-desc {
        text-align: left;
        font-size: 7.5pt;
    }
    .despeje-table .label {
        font-size: 7pt;
        text-align: left;
        vertical-align: top;
        padding-top: 4px;
    }

    /* 6. Muestra Unitaria */
    .muestra-table td {
        height: 25px;
        text-align: left;
        padding-left: 20px;
    }
    .muestra-table .label {
        font-size: 8pt;
        text-align: left;
    }

    /* 7 & 8. Resumen y Responsables */
    .summary-table td {
        height: 30px;
    }
    .responsible-table td {
        height: 40px;
        vertical-align: bottom;
        font-size: 7.5pt;
    }

    /* 9. Validación */
    .validation-table .label {
        text-align: left;
        font-size: 8pt;
    }
    .validation-table td {
        height: 45px;
        vertical-align: bottom;
        text-align: left;
    }
    @media print {
        .page-break {
            page-break-before: always;
        }
    }
</style>
`;

const getStyles2 = () => `
<style>
    :root {
        --base-font: 8pt;
        --small-font: 7pt;
        --line-height: 1.2;
        --border-color: #000;
        --primary-green: #d9d9d9;
        --header-bg: #f2f2f2;
        --background-paper: #fff;
        --text-color: #000;
    }
    .page2-body {
        font-family: Arial, sans-serif;
        color: var(--text-color);
        font-size: var(--base-font);
        line-height: var(--line-height);
    }
    .page2-document-container {
        width: 180mm;
        margin: 20px auto;
        border: 1.5px solid #000;
        background-color: var(--background-paper);
        padding: 5mm;
        box-sizing: border-box;
    }
    .page2-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 5px;
        font-size: var(--base-font);
    }
    .page2-table td, .page2-table th {
        border: 1px solid var(--border-color);
        padding: 2px 4px;
        vertical-align: top;
    }
    .page2-header-table { border: none; margin-bottom: 0; }
    .page2-header-table td { border: none; padding: 0; }
    .page2-header-logo {
        width: 20%;
        border-right: 1px solid var(--border-color);
        padding-right: 5px;
        vertical-align: middle;
        text-align: center;
    }
    .page2-header-logo img { max-width: 70px; height: auto; display: block; margin: 0 auto; }
    .page2-header-small-text { font-size: 0.7em; margin-top: 2px; }
    .page2-header-title {
        width: 50%;
        border-right: 1px solid var(--border-color);
        text-align: center;
        vertical-align: middle;
        font-size: 0.8em;
        font-weight: bold;
    }
    .page2-header-title h1 { font-size: 1.4em; margin: 3px 0 0; }
    .page2-header-meta-label { width: 15%; font-size: 0.7em; font-weight: bold; text-align: right; padding-right: 5px; }
    .page2-header-meta-value { width: 15%; font-size: 0.7em; border-bottom: 1px solid var(--border-color); }
    .page2-section-title-bar {
        background-color: var(--primary-green);
        color: #000;
        font-weight: bold;
        padding: 2px 5px;
        font-size: 0.8em;
        text-align: center;
        border: 1px solid var(--border-color);
        border-bottom: none;
    }
    .page2-section-title-bar:first-of-type { margin-top: 10px; }
    .green-bg { background-color: #eaf1dd !important; }
    .page2-data-table th, .page2-data-table td { text-align: left; }
    .page2-data-table.small-margin-top { margin-top: 5px; }
    .page2-data-table .label-cell { font-weight: bold; }
    .page2-data-table .thin-border { border-right: 1px solid var(--border-color); }
    .page2-data-table .no-border-top { border-top: none; }
    .page2-data-table .no-border-right { border-right: none; }
    .control-empaque-table th, .control-empaque-table td { text-align: center; font-size: 0.7em; }
    .control-empaque-table th[rowspan="2"] { vertical-align: middle; }
    .control-empaque-table td { height: 14px; }
    .control-indicadores-table th { text-align: center; background-color: var(--header-bg); font-size: 0.75em; }
    .control-indicadores-table td { height: 14px; }
    .control-indicadores-table .small-text { font-size: var(--small-font); }
    .codificado-table { table-layout: fixed; }
    .codificado-table td, .codificado-table th { vertical-align: middle; padding: 2px; height: 18px; font-size: var(--base-font); }
    .header-gray { background-color: #ccc; font-weight: bold; font-size: 0.7rem; text-align: center; }
    .big-empty-box { width: calc(60% - 2px); }
    .label-cell-small { width: 30px; white-space: nowrap; font-size: 0.7rem; font-weight: bold; text-align: right; padding-right: 5px; }
    .input-cell-border { border: 1px solid #000; }
    .format-label { font-size: 0.65rem; white-space: nowrap; width: 100px; text-align: center; border-left: 1px solid #000; }
    .question-table td { height: 20px; vertical-align: middle; }
    .question-table td:first-child { width: 80%; font-weight: bold; background-color: var(--header-bg); }
    .question-table .checkbox-cell { width: 10%; text-align: center; }
    .control-inventario-table th { text-align: center; background-color: var(--header-bg); font-size: 0.75em; }
    .control-inventario-table td { height: 16px; }
    .validation-table { margin-top: 10px; }
    .validation-table td { border: none; padding-bottom: 10px; }
    .signature-label { font-weight: bold; text-align: center; font-size: 0.7em; }
    .signature-line { border-bottom: 1px solid var(--border-color); }
    .signature-label-small { font-size: var(--small-font); text-align: center; }
    .signature-line-small { border-bottom: 1px solid var(--border-color); height: 10px; }
</style>
`;

const renderHtml2 = (data, logoDataUrl) => `
<div class="page-break"></div>
<div class="page2-document-container" id="documento">
    <table class="page2-table page2-header-table">
        <tr>
            <td rowspan="2" class="page2-header-logo">
                ${logoDataUrl ? `<img src="${logoDataUrl}" alt="Logo Laboratorios">` : '<img src="https://via.placeholder.com/100x40?text=Laboratorios" alt="Logo Laboratorios">'}
                <div class="page2-header-small-text">Dpto. Emisor: Planificación y Compras</div>
            </td>
            <td rowspan="2" class="page2-header-title">
                PROCEDIMIENTO DE PRODUCCIÓN
                <h1>ORDEN DE EMPAQUE</h1>
            </td>
            <td class="page2-header-meta-label">Código:</td>
            <td class="page2-header-meta-value">F-EM-PR001-4</td>
        </tr>
        <tr>
            <td class="page2-header-meta-label">Revisión:</td>
            <td class="page2-header-meta-value">1</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="page2-header-meta-label">Fecha:</td>
            <td class="page2-header-meta-value">${data.fecha_emision || '19/10/2025'}</td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td class="page2-header-meta-label">Página:</td>
            <td class="page2-header-meta-value">2/2</td>
        </tr>
    </table>

    <div class="page2-section-title-bar">ORDEN DE EMPAQUE</div>
    <table class="page2-table page2-data-table small-margin-top">
        <tr>
            <td class="label-cell thin-border" style="width: 15%;">Nº Lote:</td>
            <td class="input-cell" style="width: 25%;">${data.lote || ''}</td>
            <td class="label-cell" style="width: 15%;">CÓDIGO</td>
            <td class="input-cell" style="width: 20%;">${data.codigo_producto || ''}</td>
            <td class="label-cell" style="width: 10%;">Nº/ID</td>
            <td class="input-cell" style="width: 15%;">${data.orden ? data.orden + '-1' : ''}</td>
        </tr>
    </table>

    <div class="page2-section-title-bar green-bg">INFORMACIÓN</div>
    <table class="page2-table page2-data-table">
        <thead>
            <tr>
                <th style="width: 25%;">PESO DEL GRANEL</th>
                <th style="width: 25%;">DENSIDAD</th>
                <th style="width: 25%;">PESO NETO DE LLENADO</th>
                <th style="width: 25%;">UNIDADES REALES</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>UNIDADES TEÓRICAS</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </tbody>
    </table>

    <div class="page2-section-title-bar green-bg">CONTROL DE EMPAQUE</div>
    <table class="page2-table control-empaque-table">
        <thead>
            <tr>
                <th rowspan="2" style="width: 10%;">CÓDIGO</th>
                <th rowspan="2" style="width: 30%;">DESCRIPCIÓN</th>
                <th colspan="5">CONTROL DE EMPAQUE</th>
                <th rowspan="2" style="width: 10%;">RESPONSABLE RECEPCIÓN</th>
            </tr>
            <tr>
                <th style="width: 10%;">CANT. ENTREGADA</th>
                <th style="width: 10%;">Nº TRASLADO</th>
                <th style="width: 10%;">LOTE INSUMOS</th>
                <th style="width: 10%;">CANT. DEFECTUOSA</th>
                <th style="width: 10%;">CANT. USADA</th>
            </tr>
        </thead>
        <tbody>
            ${Array(10).fill('<tr><td>IND</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>').join('')}
        </tbody>
    </table>

    <table class="page2-table page2-data-table no-border-top">
        <tr>
            <td class="label-cell" style="width: 15%;">Observaciones:</td>
            <td style="border-bottom: 1px solid black;"></td>
            <td class="label-cell no-border-right" style="width: 10%;">Mermas</td>
            <td style="border-bottom: 1px solid black;"></td>
            <td class="label-cell" style="width: 20%;">Firma Jefe de Almacen</td>
            <td style="border-bottom: 1px solid black;"></td>
        </tr>
    </table>

    <table class="page2-table control-indicadores-table">
        <thead>
            <tr>
                <th colspan="2">CONTROL DE LLENADO</th>
                <th colspan="2">CONTROL DE INDICADORES</th>
                <th colspan="2">CONTROL DE ETIQUETADO</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="label-cell small-text" style="width: 12%;">FECHA INICIO</td>
                <td class="input-cell" style="width: 20%;"></td>
                <td class="label-cell small-text" style="width: 12%;">MOD:</td>
                <td class="input-cell" style="width: 20%;"></td>
                <td class="label-cell small-text" style="width: 12%;">RESPONSABLES</td>
                <td class="input-cell" style="width: 20%;"></td>
            </tr>
             <tr>
                <td class="label-cell small-text">FECHA FIN</td>
                <td class="input-cell"></td>
                <td class="label-cell small-text">MOD:</td>
                <td class="input-cell"></td>
                <td class="label-cell small-text">Responsable Llenado:</td>
                <td class="input-cell"></td>
            </tr>
             <tr>
                <td class="label-cell small-text">FECHA INICIO</td>
                <td class="input-cell"></td>
                <td class="label-cell small-text">MOD:</td>
                <td class="input-cell"></td>
                <td class="label-cell small-text">Responsable Etiquetado:</td>
                <td class="input-cell"></td>
            </tr>
             <tr>
                <td class="label-cell small-text">FECHA FIN</td>
                <td class="input-cell"></td>
                <td class="label-cell small-text">MOD:</td>
                <td class="input-cell"></td>
                <td class="label-cell small-text">Responsable Codificado:</td>
                <td class="input-cell"></td>
            </tr>
        </tbody>
    </table>

    <div class="page2-section-title-bar green-bg">CONTROL DE CODIFICADO</div>
    <table class="page2-table codificado-table">
        <tr>
            <th colspan="3" class="header-gray">CARACTERES A CODIFICAR</th>
            <td rowspan="5" class="big-empty-box"></td>
        </tr>
        <tr>
            <td class="label-cell-small bold-text">L:</td>
            <td class="input-cell-border">${data.lote || ''}</td>
            <td class="format-label">Formato (AAMMCC)</td>
        </tr>
        <tr>
            <td class="label-cell-small bold-text">V:</td>
            <td class="input-cell-border">${data.fecha_vencimiento ? data.fecha_vencimiento.substring(3) : ''}</td>
            <td class="format-label">Formato (MM-AA)</td>
        </tr>
        <tr>
            <td class="label-cell-small bold-text">ESTUCHE:</td>
            <td colspan="2" class="input-cell-border"></td>
        </tr>
        <tr>
            <td class="label-cell-small bold-text">CPE (SI APLICA):</td>
            <td colspan="2" class="input-cell-border"></td>
        </tr>
    </table>

    <table class="page2-table question-table">
        <tr>
            <td>¿Se generó el compuesto del producto terminado?</td>
            <td class="checkbox-cell"></td>
            <td class="checkbox-cell"></td>
        </tr>
    </table>

    <div class="page2-section-title-bar green-bg">CONTROL DE INVENTARIO DE PRODUCTO TERMINADO</div>
    <table class="page2-table control-inventario-table">
        <thead>
            <tr>
                <th rowspan="2" style="width: 25%;">Unidades obtenidas:</th>
                <th colspan="2">Unidades a comercial</th>
                <th rowspan="2" style="width: 25%;">Responsable</th>
            </tr>
            <tr>
                <th style="width: 25%;">Unidades</th>
                <th style="width: 25%;">Nº Traslado</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="label-cell">COMERCIAL</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td class="label-cell">RECHAZADOS</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td class="label-cell">RETENCIÓN</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td class="label-cell" style="vertical-align: top;">Observaciones:</td>
                <td colspan="3" style="height: 30px;"></td>
            </tr>
        </tbody>
    </table>

    <div class="page2-section-title-bar green-bg">VALIDACIÓN</div>
    <table class="page2-table validation-table">
        <tr>
            <td class="signature-label">Líder de Producción</td>
            <td class="signature-line"></td>
            <td class="signature-label">Líder de Empaque</td>
            <td class="signature-line"></td>
            <td class="signature-label">Control de Calidad</td>
            <td class="signature-line"></td>
        </tr>
        <tr>
            <td class="signature-label-small">Fecha:</td>
            <td class="signature-line-small"></td>
            <td class="signature-label-small">Fecha:</td>
            <td class="signature-line-small"></td>
            <td class="signature-label-small">Fecha:</td>
            <td class="signature-line-small"></td>
        </tr>
    </table>
</div>
`;

const renderHtml = (data, logoDataUrl) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Orden de Empaque</title>
    ${getStyles()}
    ${getStyles2()}
</head>
<body class="page2-body">

    <div class="document-container">

        <table class="production-header">
            <tbody>
                <tr>
                    <td class="section logo-area">
                        <div class="logo-container">
                            ${logoDataUrl ? `<img src="${logoDataUrl}" alt="logo" style="width: 90%;"/>` : ''}
                        </div>
                    </td>

                    <td class="section center-area">
                        <div class="center-content">
                            <div class="top-row">
                                ${data.subtitle || 'Procedimiento de empaque'}
                            </div>
                            <div class="main-title">
                                ${data.titulo || 'ORDEN DE EMPAQUE'}
                            </div>
                        </div>
                    </td>

                    <td class="section info-area">
                        <div class="info-row">Código: F-EM-PR001 </div>
                        <div class="info-row">Revisión: 2 </div>
                        <div class="info-row">Fecha de emisión: 18/11/2025 </div>
                        <div class="info-row">Vigencia hasta: 18/11/2028</div>
                        <div class="info-row page-number">Página: 1/2 </div>
                    </td>
                </tr>
                
                <tr class="emitter-row">
                    <td class="emitter-cell" colspan="3"> 
                        Departamento Emisor: <strong>Planificación y Compras</strong>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="section-title no-border-top">PRODUCTO TERMINADO</div>
        <div class="section-title no-border-top">ORDEN DE PLANIFICACIÓN</div>
        
        <table class="main-table planificacion-table no-border-top">
            <tbody>
                <tr>
                    <td style="width: 16%;"><span class="label">Nº Lote:</span><span class="data">${data.lote}</span></td>
                    <td style="width: 16%;"><span class="label">Orden:</span><span class="data">${data.orden + '-1'}</span></td>
                    <td colspan="2" rowspan="3" class="data-large" style="width: 43%;">
                        <div style="border: 1px solid #000; border-radius: 8px; padding: 4px; margin-top: 2px; min-height: 40px;">
                            <span class="label">Descripción Producto</span>
                            <br>
                            ${data.nombre}
                        </div>
                    </td>
                    <td style="width: 25%;"><span class="label">Fecha Empaque Est:</span><span class="data">${data.fecha_empaque_est }</span></td>
                </tr>
                <tr>
                    <td><span class="label">Código Producto:</span><span class="data">${data.codigo_producto }</span></td>
                    <td><span class="label">Fecha Emisión Orden:</span><span class="data">${data.fecha_emision_orden }</span></td>
                    <td><span class="label">Fecha Vencimiento:</span><span class="data">${data.fecha_vencimiento}</span></td>
                </tr>
                <tr>
                    <td colspan="2"><span class="label">Registro Sanitario:</span><span class="data">${data.registro_sanitario || ''}</span></td>
                    <td><span class="label">Unidades a Envasar:</span><span class="data">${data.unidades_a_envasar }</span></td>
                </tr>
            </tbody>
        </table>

        <div class="section-title">DESPEJE DE ÁREA DE EMPAQUE</div>
        <table class="main-table despeje-table no-border-top">
            <thead>
                <tr>
                    <th style="width: 3%;"></th>
                    <th class="text-left"><span class="label">Verifique su conformidad o inconformidad (marque con una X)</span></th>
                    <th style="width: 8%;"><span class="label">Conforme</span></th>
                    <th style="width: 8%;"><span class="label">Inconforme</span></th>
                    <th style="width: 25%;"><span class="label">RESPONSABLE</span></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center">1</td>
                    <td class="item-desc">Líneas de empaque identificadas correctamente </td>
                    <td></td><td></td>
                    <td rowspan="2"></td>
                </tr>
                <tr>
                    <td class="text-center">2</td>
                    <td class="item-desc">Utensilios necesarios disponibles (materiales e instrumentos)</td>
                    <td></td><td></td>
                </tr>
                <tr>
                    <td class="text-center">3</td>
                    <td class="item-desc">Equipos Limpios con etiqueta que lo compruebe</td>
                    <td></td><td></td>
                    <td class="label">FECHA:</td>
                </tr>
                <tr>
                    <td class="text-center">4</td>
                    <td class="item-desc">Material de empaque para el producto, disponibles y correctamente identificados </td>
                    <td></td><td></td>
                    <td rowspan="3"></td>
                </tr>
                <tr>
                    <td class="text-center">5</td>
                    <td class="item-desc">Documentos del producto a empacar disponibles </td>
                    <td></td><td></td>
                </tr>
                <tr>
                    <td class="text-center">6</td>
                    <td class="item-desc">No existen restos de producto fabricado anteriormente</td>
                    <td></td><td></td>
                </tr>
                <tr>
                    <td class="text-center">7</td>
                    <td class="item-desc">No existe documentación del producto fabricado anteriormente</td>
                    <td></td><td></td>
                    <td class="label">HORA:</td>
                </tr>
            </tbody>
        </table>

        <div class="section-title">CONTROL DE PESO</div>
        <table class="main-table no-border-top text-center">
            <thead>
                <tr>
                    <th colspan="2">Límite Inferior Neto</th>
                    <th colspan="2">Valor Medio Neto</th>
                    <th colspan="2">Límite Superior Neto</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="width: 16.6%;"><span class="label">Valor Real</span></td>
                    <td style="width: 16.6%;"> </td>
                    <td style="width: 16.6%;"><span class="label">Valor Real</span></td>
                    <td style="width: 16.6%;"></td>
                    <td style="width: 16.6%;"><span class="label">Valor Real</span></td>
                    <td style="width: 16.6%;"></td>
                </tr>
            </tbody>
        </table>

        <div class="section-title">PESO DE ENVASES</div>
        <table class="main-table no-border-top">
            <tr>
                <td style="width: 6.66%; height: 22px;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
                <td style="width: 6.66%;"></td>
            </tr>
        </table>
        <table class="main-table no-border-top">
            <tr>
                <td style="width: 50%; height: 10px;"><span class="label">PROMEDIO ENVASE </span></td>
                <td style="width: 50%; height: 10px;"><span class="label">PESO BRUTO</span></td>
            </tr>
        </table>
        
        <div class="section-title">MUESTRA UNITARIA (PESO BRUTO EN GRAMOS)</div>
        <table class="main-table muestra-table no-border-top">
            <tbody>
                <tr>
                    <td style="width: 20%;"><span class="label">1</span></td>
                    <td style="width: 20%;"><span class="label">2</span></td>
                    <td style="width: 20%;"><span class="label">3</span></td>
                    <td style="width: 20%;"><span class="label">4</span></td>
                    <td style="width: 20%;"><span class="label">5</span></td>
                </tr>
                <tr>
                    <td><span class="label">6</span></td> <td><span class="label">7</span></td> <td><span class="label">8</span></td> <td><span class="label">9</span></td> <td><span class="label">10</span></td>
                </tr>
                <tr>
                    <td><span class="label">11</span></td> <td><span class="label">12</span></td> <td><span class="label">13</span></td> <td><span class="label">14</span></td> <td><span class="label">15</span></td>
                </tr>
                <tr>
                    <td><span class="label">16</span></td> <td><span class="label">17</span></td> <td><span class="label">18</span></td> <td><span class="label">19</span></td> <td><span class="label">20</span></td>
                </tr>
                <tr>
                    <td><span class="label">21</span></td> <td><span class="label">22</span></td> <td><span class="label">23</span></td> <td><span class="label">24</span></td> <td><span class="label">25</span></td>
                </tr>
                <tr>
                    <td><span class="label">26</span></td> <td><span class="label">27</span></td> <td><span class="label">28</span></td> <td><span class="label">29</span></td> <td><span class="label">30</span></td>
                </tr>
                <tr>
                    <td><span class="label">31</span></td> <td><span class="label">32</span></td> <td><span class="label">33</span></td> <td><span class="label">34</span></td> <td><span class="label">35</span></td>
                </tr>
            </tbody>
        </table>

        <table class="main-table summary-table">
            <tbody>
                <tr>
                    <td style="width: 25%;"><span class="label">Peso Promedio Contenido Neto:</span><br></td>
                    <td style="width: 25%;"><span class="label">Peso Promedio Contenido Bruto:</span><br></td>
                    <td style="width: 25%;"><span class="label">Desviación Estándar Contenido Neto:</span><br></td>
                    <td style="width: 25%;"><span class="label">Desviación Estándar Contenido Bruto:</span><br></td>
                </tr>
            </tbody>
        </table>

        <table class="main-table responsible-table no-border-top">
            <tbody>
                <tr>
                    <td style="width: 50%;"><span class="label">Responsable Control Peso</span><br><br><span class="label">Fecha:</span></td>
                    <td style="width: 50%;"><span class="label">Responsable Control de Calidad </span><br><br><span class="label">Fecha:</span></td>
                </tr>
            </tbody>
        </table>
        
        <div class="section-title">VALIDACIÓN</div>
        <table class="main-table validation-table no-border-top">
            <tbody>
                <tr>
                    <td style="width: 33.3%;">
                        <span class="label">Lider de Producción</span><br><br>
                        <span class="label">Fecha:</span>
                    </td>
                    <td style="width: 33.3%;">
                        <span class="label">Jefe de Producción</span><br><br>
                        <span class="label">Fecha:</span>
                    </td>
                    <td style="width: 33.3%;">
                        <span class="label">Control de Calidad</span><br><br>
                        <span class="label">Fecha:</span>
                    </td>
                </tr>
            </tbody>
        </table>

    </div>
    ${renderHtml2(data, logoDataUrl)}
</body>
</html>
`;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
        return;
    }

    const puppeteerModule = await getPuppeteer();
    if (!puppeteerModule) {
        return res.status(500).json({ error: 'puppeteer_not_installed', detail: 'Install "puppeteer" or "puppeteer-core"' });
    }

    const puppeteer = puppeteerModule.default || puppeteerModule;
    const launchOptions = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
    const execPath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_PATH || process.env.CHROME_BIN;
    if (execPath) {
        launchOptions.executablePath = execPath;
    }

    let browser;
    try {
        browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();

        let logoDataUrl = null;
        try {
            const logoPath = path.join(process.cwd(), 'ol_color.png');
            const buf = await fs.readFile(logoPath);
            logoDataUrl = `data:image/png;base64,${buf.toString('base64')}`;
        } catch (e) {
            // Logo not found, proceed without it
        }

        const data = req.body || {};

        if (data.fecha_empaque_est && data.fecha_empaque_est.includes('-')) {
            const dateParts = data.fecha_empaque_est.split('-');
            // Assuming YYYY-MM-DD, converting to DD/MM/YYYY
            if (dateParts.length === 3 && dateParts[0].length === 4) {
                data.fecha_empaque_est = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            }
        }

        const today = new Date();
        if (!data.fecha_emision_orden) {
            data.fecha_emision_orden = today.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        if (!data.fecha_emision) {
            data.fecha_emision = today.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }


        const html = renderHtml(data, logoDataUrl);
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ 
            format: 'letter',
            printBackground: true, 
            margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } 
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=empaque.pdf');
        res.status(200).send(pdfBuffer);
    } catch (err) {
        console.error('PDF generation error', err);
        res.status(500).json({ error: 'pdf_generation_failed', detail: String(err) });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}