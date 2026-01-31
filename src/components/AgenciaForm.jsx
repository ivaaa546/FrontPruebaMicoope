import { useState, useEffect } from 'react';
import './AgenciaForm.css';

const AgenciaForm = ({ agencia, municipios, departamentos, onGuardar, onCancelar }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        serie: '',
        codigo: '',
        direccion: '',
        id_municipio: '',
        telefono: '',
        estado: true
    });

    const [horarios, setHorarios] = useState([
        { id_dia: 1, nombre: 'Lun-Vie', hora_apertura: '08:00', hora_cierre: '17:00', cerrado: false },
        { id_dia: 6, nombre: 'Sábado', hora_apertura: '08:00', hora_cierre: '12:00', cerrado: false },
        { id_dia: 7, nombre: 'Domingo', hora_apertura: '', hora_cierre: '', cerrado: true }
    ]);

    const [error, setError] = useState('');
    const [esNuevoMunicipio, setEsNuevoMunicipio] = useState(false);
    const [nuevoMunicipio, setNuevoMunicipio] = useState({ nombre: '', id_departamento: '', codigo: '' });

    useEffect(() => {
        if (agencia) {
            setFormData({
                nombre: agencia.nombre || '',
                serie: agencia.serie || '',
                codigo: agencia.codigo || '',
                direccion: agencia.direccion || '',
                id_municipio: agencia.id_municipio || '',
                telefono: agencia.telefono || '',
                estado: agencia.estado !== undefined ? agencia.estado : true
            });

            if (agencia.horarios_agencia && agencia.horarios_agencia.length > 0) {
                const hList = agencia.horarios_agencia;
                const lun = hList.find(h => h.id_dia === 1) || hList.find(h => h.dias_semana?.orden === 1);
                const sab = hList.find(h => h.id_dia === 6) || hList.find(h => h.dias_semana?.orden === 6);
                const dom = hList.find(h => h.id_dia === 7) || hList.find(h => h.dias_semana?.orden === 7);

                setHorarios([
                    {
                        id_dia: 1, nombre: 'Lun-Vie',
                        hora_apertura: lun?.hora_apertura?.slice(0, 5) || '08:00',
                        hora_cierre: lun?.hora_cierre?.slice(0, 5) || '17:00',
                        cerrado: lun?.cerrado ?? false
                    },
                    {
                        id_dia: 6, nombre: 'Sábado',
                        hora_apertura: sab?.hora_apertura?.slice(0, 5) || '08:00',
                        hora_cierre: sab?.hora_cierre?.slice(0, 5) || '12:00',
                        cerrado: sab?.cerrado ?? false
                    },
                    {
                        id_dia: 7, nombre: 'Domingo',
                        hora_apertura: dom?.hora_apertura?.slice(0, 5) || '',
                        hora_cierre: dom?.hora_cierre?.slice(0, 5) || '',
                        cerrado: dom?.cerrado ?? true
                    }
                ]);
            }
        }
    }, [agencia]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (error) setError('');
    };

    const handleNuevoMunicipioChange = (e) => {
        const { name, value } = e.target;
        setNuevoMunicipio(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleHorarioChange = (index, field, value) => {
        const newHorarios = [...horarios];
        newHorarios[index][field] = value;
        setHorarios(newHorarios);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.nombre.trim().length < 3) return setError('El nombre debe tener al menos 3 caracteres');
        if (!formData.serie.trim()) return setError('La serie es obligatoria');
        if (!formData.codigo.trim()) return setError('El código es obligatorio');

        if (!esNuevoMunicipio && !formData.id_municipio) return setError('Seleccione un municipio');
        if (esNuevoMunicipio) {
            if (!nuevoMunicipio.nombre.trim()) return setError('Ingrese el nombre del nuevo municipio');
            if (!nuevoMunicipio.id_departamento) return setError('Seleccione el departamento para el nuevo municipio');
        }

        try {
            const finalHorarios = [];
            horarios.forEach(grupo => {
                if (grupo.id_dia === 1) {
                    for (let i = 1; i <= 5; i++) {
                        finalHorarios.push({
                            id_dia: i,
                            hora_apertura: grupo.cerrado ? null : grupo.hora_apertura,
                            hora_cierre: grupo.cerrado ? null : grupo.hora_cierre,
                            cerrado: grupo.cerrado
                        });
                    }
                } else {
                    finalHorarios.push({
                        id_dia: grupo.id_dia,
                        hora_apertura: grupo.cerrado ? null : grupo.hora_apertura,
                        hora_cierre: grupo.cerrado ? null : grupo.hora_cierre,
                        cerrado: grupo.cerrado
                    });
                }
            });

            await onGuardar({
                ...formData,
                id_municipio: esNuevoMunicipio ? null : parseInt(formData.id_municipio),
                nuevoMunicipioData: esNuevoMunicipio ? nuevoMunicipio : null,
                horarios: finalHorarios
            });
        } catch (err) {
            const errorData = err.response?.data;
            const dbError = errorData?.error || errorData;
            const msg = (errorData?.message || dbError?.message || dbError?.details || JSON.stringify(dbError)).toLowerCase();

            if (dbError?.code === '23505' || msg.includes('duplicate') || msg.includes('already exists')) {
                if (msg.includes('serie')) {
                    setError('La SERIE ingresada ya existe en otra agencia');
                } else if (msg.includes('codigo')) {
                    setError('El CÓDIGO ingresado ya existe en otra agencia');
                } else if (msg.includes('id_departamento') || msg.includes('municipios_nombre')) {
                    setError('Este MUNICIPIO ya existe en el departamento seleccionado.');
                } else {
                    setError('Ya existe un registro con estos datos únicos (Serie o Código)');
                }
            } else {
                setError(errorData?.message || errorData?.error || 'Error al guardar los cambios');
            }
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h2>{agencia ? 'Editar Agencia' : 'Nueva Agencia'}</h2>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nombre de la Agencia *</label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ej: Agencia Cobán Central"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row two-columns">
                        <div className="form-group">
                            <label>Serie *</label>
                            <input
                                type="text"
                                name="serie"
                                value={formData.serie}
                                onChange={handleChange}
                                placeholder="Ej: A"
                                maxLength={10}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Código de Agencia *</label>
                            <input
                                type="text"
                                name="codigo"
                                value={formData.codigo}
                                onChange={handleChange}
                                placeholder="Ej: 16001"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Dirección Física *</label>
                            <textarea
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                placeholder="3a. Avenida 1-05 zona 4..."
                                rows={2}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ margin: 0 }}>Municipio / Departamento *</label>
                                <button
                                    type="button"
                                    className="btn-toggle-nuevo"
                                    onClick={() => setEsNuevoMunicipio(!esNuevoMunicipio)}
                                >
                                    {esNuevoMunicipio ? 'Seleccionar existente' : '+ Agregar nuevo municipio'}
                                </button>
                            </div>

                            {!esNuevoMunicipio ? (
                                <select
                                    name="id_municipio"
                                    value={formData.id_municipio}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar municipio...</option>
                                    {municipios.map(m => (
                                        <option key={m.id_municipio} value={m.id_municipio}>
                                            {m.nombre} ({m.departamentos?.nombre})
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="nuevo-municipio-container">
                                    <div className="nuevo-municipio-fields">
                                        <input
                                            type="text"
                                            name="nombre"
                                            placeholder="Nombre del municipio"
                                            value={nuevoMunicipio.nombre}
                                            onChange={handleNuevoMunicipioChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="codigo"
                                            placeholder="Código (Ej: 1601)"
                                            value={nuevoMunicipio.codigo}
                                            onChange={handleNuevoMunicipioChange}
                                            maxLength={10}
                                        />
                                    </div>
                                    <select
                                        name="id_departamento"
                                        value={nuevoMunicipio.id_departamento}
                                        onChange={handleNuevoMunicipioChange}
                                        required
                                        style={{ marginTop: '0.5rem' }}
                                    >
                                        <option value="">Seleccionar departamento...</option>
                                        {departamentos.map(d => (
                                            <option key={d.id_departamento} value={d.id_departamento}>
                                                {d.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-row two-columns">
                        <div className="form-group">
                            <label>Teléfono de contacto</label>
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="7929XXXX"
                            />
                        </div>
                        <div className="form-group checkbox" style={{ alignSelf: 'center', paddingTop: '1.2rem' }}>
                            <label>
                                <input
                                    type="checkbox"
                                    name="estado"
                                    checked={formData.estado}
                                    onChange={handleChange}
                                />
                                <span style={{ fontWeight: 600 }}>Agencia Activa</span>
                            </label>
                        </div>
                    </div>

                    <div className="horarios-section">
                        <h3>Días y Horarios de atención</h3>
                        {horarios.map((h, index) => (
                            <div key={h.id_dia} className="horario-row">
                                <span className="dia-label">{h.nombre}:</span>
                                <div className="horario-inputs">
                                    <input
                                        type="time"
                                        value={h.hora_apertura}
                                        onChange={(e) => handleHorarioChange(index, 'hora_apertura', e.target.value)}
                                        disabled={h.cerrado}
                                    />
                                    <span>a</span>
                                    <input
                                        type="time"
                                        value={h.hora_cierre}
                                        onChange={(e) => handleHorarioChange(index, 'hora_cierre', e.target.value)}
                                        disabled={h.cerrado}
                                    />
                                    <label className="cerrado-check">
                                        <input
                                            type="checkbox"
                                            checked={h.cerrado}
                                            onChange={(e) => handleHorarioChange(index, 'cerrado', e.target.checked)}
                                        />
                                        Cerrado
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onCancelar} className="btn-cancelar">
                            Cancelar
                        </button>
                        <button type="submit" className="btn-guardar">
                            {agencia ? 'Actualizar Agencia' : 'Guardar Agencia'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgenciaForm;
